import mongoose from 'mongoose';

import User from './user';
import Movie from './movie';


const dbUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'mongodb://localhost:27017/myproject'
const connectDb = () => {
  return mongoose.connect( dbUrl );
};

const models = { User, Movie };

export { connectDb };

export default models;