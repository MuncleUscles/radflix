import mongoose from 'mongoose';

import AccessRequest from './accessRequest';
import Movie from './movie';
import Purchase from './purchase';

const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'mongodb://localhost:27017/radflix'
const connectDb = () => {
  return mongoose.connect( dbUrl );
};

const models = { AccessRequest, Movie, Purchase };

export { connectDb };

export default models;