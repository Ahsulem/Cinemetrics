import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import UserActivity from "../models/UserActivity.js";

const router = express.Router();

// Track movie view
router.post("/track-view", authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ 
        success: false,
        message: "Movie ID is required" 
      });
    }

    // Check if user already viewed this movie recently (within last hour)
    const recentView = await UserActivity.findOne({
      userId: req.user._id,
      movieId,
      activityType: 'view',
      timestamp: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (!recentView) {
      await UserActivity.create({
        userId: req.user._id,
        movieId,
        activityType: 'view'
      });
    }

    res.json({ success: true, message: "View tracked" });
  } catch (error) {
    console.error("Track view error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error tracking view" 
    });
  }
});

// Like/Unlike movie
router.post("/like", authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ 
        success: false,
        message: "Movie ID is required" 
      });
    }

    const existingLike = await UserActivity.findOne({
      userId: req.user._id,
      movieId,
      activityType: 'like'
    });

    if (existingLike) {
      await UserActivity.deleteOne({ _id: existingLike._id });
      res.json({ success: true, message: "Movie unliked", liked: false });
    } else {
      await UserActivity.create({
        userId: req.user._id,
        movieId,
        activityType: 'like'
      });
      res.json({ success: true, message: "Movie liked", liked: true });
    }
  } catch (error) {
    console.error("Like movie error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error processing like" 
    });
  }
});

// Bookmark/Unbookmark movie
router.post("/bookmark", authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.body;
    
    if (!movieId) {
      return res.status(400).json({ 
        success: false,
        message: "Movie ID is required" 
      });
    }

    const existingBookmark = await UserActivity.findOne({
      userId: req.user._id,
      movieId,
      activityType: 'bookmark'
    });

    if (existingBookmark) {
      await UserActivity.deleteOne({ _id: existingBookmark._id });
      res.json({ success: true, message: "Bookmark removed", bookmarked: false });
    } else {
      await UserActivity.create({
        userId: req.user._id,
        movieId,
        activityType: 'bookmark'
      });
      res.json({ success: true, message: "Movie bookmarked", bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark movie error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error processing bookmark" 
    });
  }
});

// Get user's bookmarked movies
router.get("/bookmarks", authenticateToken, async (req, res) => {
  try {
    const bookmarks = await UserActivity.find({
      userId: req.user._id,
      activityType: 'bookmark'
    }).sort({ timestamp: -1 });

    const movieIds = bookmarks.map(b => b.movieId);
    
    res.json({ 
      success: true, 
      bookmarks: movieIds 
    });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching bookmarks" 
    });
  }
});

export default router;