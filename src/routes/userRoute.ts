import express from 'express';
import { isAuthenticated, isLoggedIn } from './../controller/authConroller';

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
userRouter.patch('/Update_me/:id', isAuthenticated, updateProfile);
userRouter.patch('/reset_Password/:Token', isAuthenticated, resetPassword);
userRouter.post('/forget_Password', isAuthenticated, forgetPassword);
userRouter.delete('/Deactivate_acct/:id', isAuthenticated, deleteAcct);
userRouter.post('/reactivate_account', reactivateAcct);
userRouter.post('/ logout', isAuthenticated, logout);

export default userRouter;
