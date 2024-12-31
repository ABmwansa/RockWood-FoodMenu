const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // E.g., Starter, Main, Dessert
  image: { type: String }, // Optional, for URLs of images
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
