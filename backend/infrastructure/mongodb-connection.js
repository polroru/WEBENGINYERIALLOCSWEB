// infrastructure/mongodb-connection.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/backend';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectat a MongoDB'))
  .catch(err => console.error('Error connexió a MongoDB:', err));

export const mongodbInstance = mongoose;
