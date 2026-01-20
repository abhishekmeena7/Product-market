const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri || typeof uri !== 'string') {
    throw new Error(
      'MongoDB connection string is missing. Set MONGODB_URI (or MONGO_URI) in backend/.env'
    );
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
