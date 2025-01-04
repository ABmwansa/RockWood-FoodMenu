const express = require("express");
const Menu = require("../models/Menu");

const router = express.Router();

// Endpoint to fetch all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Endpoint to add a new menu item
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const newMenuItem = new Menu({ name, description, price, category, image });
    await newMenuItem.save();
    res.json({ message: "Menu item added successfully", newMenuItem });
  } catch (error) {
    res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Endpoint to delete a menu item
router.delete("/:id", async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

module.exports = router;
