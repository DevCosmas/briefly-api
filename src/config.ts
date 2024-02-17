import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const MONGODB_CONNECTION_URL: string = process.env.MONGODB_CONNECTION || '';

const mongoDbConnection = (): void => {
  mongoose.connect(MONGODB_CONNECTION_URL);
  mongoose.connection.on('connected', () => {
    console.log('Database connected successfully');
  });
  mongoose.connection.on('error', (err) => {
    console.log(`An error has occurred: ${err}`);
  });
};

export { mongoDbConnection };
