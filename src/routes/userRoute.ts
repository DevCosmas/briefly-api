import express from 'express';

import { isAuthenticated } from './../controller/authConroller';

import {
  signUp,
  login,
  updateProfile,
  reactivateAcct,
  deleteAcct,
  logout,
  resetPassword,
  forgetPassword,
} from './../controller/userController';

const userRouter = express.Router();

userRouter.post('/register', signUp);
userRouter.post('/login', login);
userRouter.patch('/Update_me', isAuthenticated, updateProfile);
userRouter.patch('/reset_Password/:Token', resetPassword);
userRouter.post('/forget_Password', forgetPassword);
userRouter.delete('/Deactivate_acct/:id', isAuthenticated, deleteAcct);
userRouter.post('/reactivate_account', reactivateAcct);
userRouter.post('/ logout', isAuthenticated, logout);

export default userRouter;
