require('dotenv').config();
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Express, Request, Response, NextFunction } from 'express';
import { userModel } from './../model/user';
import AppError from './../utils/errorhandler';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(new AppError('Unauthorized', 401));
    }
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: string; iat: number };
    const currentTime = Math.floor(Date.now() / 1000);
    console.log(currentTime);
    console.log(decodedToken.iat);
    if (decodedToken.iat > currentTime) {
      return next(new AppError('Token expired', 401));
    }

    const user = await userModel.findById(decodedToken.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }
    {
      (req as any).user = user;
    }

    next();
  } catch (err: any) {
    next(new AppError(err.message, 500)); // Handle any unexpected errors
  }
};

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies.jwt) {
      return next(new AppError('kindly login or sign up', 401));
    } else if (req.cookies.jwt) {
      const decodedToken = jwt.verify(
        req.cookies.jwt,
        process.env.JWT_SECRET_KEY as string
      ) as { id: string; iat: number; exp: number };
      const currentTime = Math.floor(Date.now() / 1000);
      const user = await userModel.findById(decodedToken.id);

      if (user && decodedToken.iat < currentTime) res.locals.user = user;
      return next();
    }

    next();
  } catch (err: any) {
    next(new AppError(err, 500));
  }
};

export { isAuthenticated, isLoggedIn };
