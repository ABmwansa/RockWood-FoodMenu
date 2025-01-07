const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

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

// Conditional MongoDB Connection
const dbURI = process.env.NODE_ENV === 'production' ? process.env.CLOUD_DB_URI : process.env.LOCAL_DB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "FoodMenu",
  })
  .then(() => console.log(`Connected to MongoDB at ${process.env.NODE_ENV === 'production' ? 'Atlas' : 'localhost'}`))
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
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'pending', enum: ['pending', 'approved'] }, // New field for role management
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
const Admin = mongoose.model('Admin', AdminSchema);

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

// Order Routes
app.post("/api/orders", async (req, res) => {
  try {
    const { foodId, quantity, totalPrice, tableNumber, userId } = req.body;

    if (!foodId || !quantity || !totalPrice || !tableNumber) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

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


// **Sign Up Endpoint**
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = new Admin({ name, email, password: hashedPassword });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin account created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating admin account. Email may already exist.' });
  }
});

// **Login Endpoint**
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).json({ error: 'Admin account not found.' });
    if (admin.role === 'pending') return res.status(403).json({ error: 'Admin account not yet approved.' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials.' });

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, email: admin.email }, 'secret_key', { expiresIn: '1h' });

    res.json({ token, message: 'Login successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// **Get Pending Accounts**
app.get('/pending-accounts', async (req, res) => {
  try {
    const pendingAdmins = await Admin.find({ role: 'pending' });
    res.json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending accounts.' });
  }
});

//approve account
app.put('/approve-account/:id', async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`Approving admin account with ID: ${id}`); // Add logging here

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { role: 'approved' },
      { new: true } // Ensures the updated document is returned
    );

    if (!updatedAdmin) {
      console.error('Admin account not found'); // Log error if account not found
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    const token = jwt.sign({ id: updatedAdmin._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    console.log('Account approved successfully'); // Log success
    return res.status(200).json({
      message: 'Admin account approved successfully!',
      token,
    });
  } catch (error) {
    console.error('Error approving account:', error); // Log detailed error
    res.status(500).json({ error: 'Internal Server Error.' });
  }
});


// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
