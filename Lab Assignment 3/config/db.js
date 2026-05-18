const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/noirStepsDB');
    console.log('Connected to MongoDB successfully via Config Layer!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Stop server execution if connection fails
  }
};

module.exports = connectDB;