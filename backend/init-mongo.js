// MongoDB initialization script
db = db.getSiblingDB('netflix-clone');

// Create collections
db.createCollection('users');
db.createCollection('movies');
db.createCollection('useractivities');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });

db.movies.createIndex({ "tmdbId": 1 }, { unique: true });
db.movies.createIndex({ "genres": 1 });
db.movies.createIndex({ "rating": -1 });

db.useractivities.createIndex({ "userId": 1, "movieId": 1, "activityType": 1 });
db.useractivities.createIndex({ "userId": 1, "timestamp": -1 });

print('Database initialized successfully!');