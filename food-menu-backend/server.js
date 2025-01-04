const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static(uploadDir)); // Static file serving

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Frontend URL
  methods: 'GET,POST,PUT,DELETE', // Allowable methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers for requests
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/FoodMenudb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "FoodMenudb",
  })
  .then(() => console.log("Connected to MongoDB at localhost"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set upload path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set unique file name
  },
});
const upload = multer({ storage });

// Schemas and Models
const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});
// Mongoose User Schema
const adminSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
});

const orderSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  orderDate: { type: String, required: true },
  tableNumber: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Optional field
});

const deletedFoodSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  deletedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const Food = mongoose.model("Food", foodSchema);
const Order = mongoose.model("Order", orderSchema);
const DeletedFood = mongoose.model("Deleted", deletedFoodSchema);
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Food Routes
app.post("/food", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ error: "Name, description, and price are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newFood = new Food({ name, description, price, imageUrl });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.get("/food", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.delete("/api/food/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFood = await Food.findByIdAndDelete(id);
    if (deletedFood) {
      const record = new DeletedFood({ foodId: deletedFood._id });
      await record.save();
    }

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Order Routes
app.post("/api/orders", async (req, res) => {
  try {
    const { foodId, quantity, totalPrice, tableNumber, userId } = req.body;

    // Ensure required fields are provided
    if (!foodId || !quantity || !totalPrice || !tableNumber) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Validate quantity (should be at least 1)
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Create new order
    const newOrder = new Order({
      foodId,
      quantity,
      totalPrice,
      tableNumber,
      userId,  // Optional field
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("foodId");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// User Routes
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    fullName,
    email,
    password: hashedPassword,
  });

  await newAdmin.save();
  res.status(201).send('Account created');
});

// Login admin
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(400).send('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).send('Invalid email or password');
  }

  // Create a token
  const token = jwt.sign({ id: admin._id }, 'your_jwt_secret_key', { expiresIn: '1h' });
  res.send({ message: 'Login successful', token });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
