const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Importing Routes
const menuRoutes = require("./routes/menuRoutes");

const app = express();

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(bodyParser.json()); // Parse JSON body

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/foodMenudb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB on localhost"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use("/api/menu", menuRoutes);

// Default Route (Optional, for testing server)
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
