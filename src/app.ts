import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response, NextFunction } from 'express';
import errorHandler from './controller/errorHandler';
import AppError from './utils/errorhandler';
import userRouter from './routes/userRoute';
import urlRouter from './routes/urlRoutes';
import cookieParser from 'cookie-parser';
import path from 'path';

// import helmet from 'helmet';
import morgan from 'morgan';
import { mongoDbConnection } from './config';

const PORT: number = (process.env.PORT as any) || 3000;
console.log(process.env.NODE_ENV);

// connection
const app: Express = express();
mongoDbConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/api/user', userRouter);
app.use('/', urlRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError('page not found', 404));
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Server is up and paying attention');
});
