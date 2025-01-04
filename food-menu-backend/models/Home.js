const mongoose = require("mongoose");

// Schema for Home.js
const homeSchema = new mongoose.Schema({
  featuredItems: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String }, // URL to the image
    },
  ],
  banners: [
    {
      title: { type: String, required: true },
      subtitle: { type: String },
      image: { type: String }, // URL to the banner image
    },
  ],
});

const Home = mongoose.model("Home", homeSchema);
module.exports = Home;
