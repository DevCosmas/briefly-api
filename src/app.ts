import dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response, NextFunction } from 'express';
import errorHandler from './controller/errorHandler';
import AppError from './utils/errorhandler';

import createServer from './utils/server';

const PORT: number = (process.env.PORT as any) || 3000;
console.log(process.env.NODE_ENV);

const app = createServer();

app.listen(PORT, () => {
  console.log('Server is up and paying attention');
});

export default app;
