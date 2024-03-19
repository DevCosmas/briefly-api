import express from 'express';

import { isAuthenticated } from './../controller/authConroller';

import {
  signUp,
  login,
  updateProfile,
  logout,
  resetPassword,
  forgetPassword,
} from './../controller/userController';

const userRouter = express.Router();

userRouter.post('/register', signUp);
userRouter.post('/login', login);
userRouter.patch('/Update_me/:id', isAuthenticated, updateProfile);
userRouter.patch('/reset_Password', resetPassword);
userRouter.post('/forget_Password', forgetPassword);
userRouter.post('/logout', isAuthenticated, logout);

export default userRouter;
