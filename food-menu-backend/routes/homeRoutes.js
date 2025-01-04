const express = require("express");
const Home = require("../models/Home");

const router = express.Router();

// Endpoint to get home data (featured items and banners)
router.get("/", async (req, res) => {
  try {
    const homeData = await Home.findOne(); // Assuming one record for Home
    res.json(homeData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch home data" });
  }
});

// Endpoint to add or update home data
router.post("/", async (req, res) => {
  try {
    const { featuredItems, banners } = req.body;
    let homeData = await Home.findOne();

    if (homeData) {
      homeData.featuredItems = featuredItems || homeData.featuredItems;
      homeData.banners = banners || homeData.banners;
    } else {
      homeData = new Home({ featuredItems, banners });
    }

    await homeData.save();
    res.json({ message: "Home data saved successfully", homeData });
  } catch (error) {
    res.status(500).json({ error: "Failed to save home data" });
  }
});

module.exports = router;
