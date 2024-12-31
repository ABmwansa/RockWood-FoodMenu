const express = require("express");
const MenuItem = require("../models/menuItem");

const router = express.Router();

// Add Menu Item
router.post("/add", async (req, res) => {
  const { name, description, price, category, image } = req.body;
  try {
    const newItem = new MenuItem({ name, description, price, category, image });
    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding menu item", error });
  }
});

// Get All Menu Items
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu items", error });
  }
});

module.exports = router;
