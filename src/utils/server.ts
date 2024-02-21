import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import errorHandler from '../controller/errorHandler';
import AppError from './errorhandler';
import userRouter from '../routes/userRoute';
import urlRouter from '../routes/urlRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

// import helmet from 'helmet';
import morgan from 'morgan';
import { mongoDbConnection } from '../config';

function createServer() {
  // rate limitig
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  });

  // connection
  const app: Express = express();
  mongoDbConnection();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(morgan('combined'));
  app.use(
    cors({
      origin: 'http://localhost:3000',
    })
  );
  app.use(cookieParser());
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // set rate limit
  app.use(limiter);

  // routes
  app.use('/api/user', userRouter);
  app.use('/', urlRouter);

  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('page not found', 404));
  });
  return app;
}
export default createServer;
