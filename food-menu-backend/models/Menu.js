const mongoose = require("mongoose");

// Schema for Menu
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL to the food image
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
