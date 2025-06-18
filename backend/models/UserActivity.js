import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: Number, // TMDB ID
    required: true
  },
  activityType: {
    type: String,
    enum: ['view', 'like', 'bookmark', 'rating'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
userActivitySchema.index({ userId: 1, movieId: 1, activityType: 1 });
userActivitySchema.index({ userId: 1, timestamp: -1 });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;