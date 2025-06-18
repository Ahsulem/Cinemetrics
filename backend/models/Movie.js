import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: String,
  releaseDate: Date,
  genres: [String],
  rating: Number,
  posterPath: String,
  backdropPath: String,
  runtime: Number,
  language: String,
  popularity: Number,
  voteCount: Number,
  
  // User interaction data
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  bookmarks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ popularity: -1 });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;