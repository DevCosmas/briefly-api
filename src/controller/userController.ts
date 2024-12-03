import { Request, Response, NextFunction } from 'express';
import { userModel, UserDocument } from './../model/user';
import { jwtToken } from './../utils/jwt';
import AppError from '../utils/errorhandler';
import EmailSender from '../utils/email';
import crypto from 'crypto';
import SendResponse from './../utils/sendResponse';

interface CustomRequest extends Request {
  user?: any;
}

async function signUp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = (req as any).body;
    const newUser = await userModel.create(body);
    if (!newUser) {
      return next(new AppError('Fill in the correct details please', 400));
    } else {
      const token = await jwtToken(newUser._id);
      const sendMail = new EmailSender();
      await sendMail.sendWelcomeEmail(newUser);
      res.status(201).json({
        status: 'success',
        message: 'Sign up complete',
        token,
        user: newUser,
      });
    }
  } catch (err: any) {
    next(new AppError(err, 500));
  }
}

async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const loginDetails = req.body;

    const isValidUser = await userModel.findOne({ email: loginDetails.email });
    if (!isValidUser) {
      return next(new AppError('This user is not found. Kindly sign up', 404));
    }

    const isValidPassword = await isValidUser.isValidPassword(
      loginDetails.password,
      isValidUser.password
    );

    if (!isValidPassword) {
      return next(new AppError('Invalid password or email', 400));
    }

    const token = await jwtToken(isValidUser._id);

    res.status(200).json({
      status: 'success',
      message: 'You are logged in now',
      token,
      user: isValidUser,
    });
  } catch (err: any) {
    next(new AppError(err, 500));
  }
}

async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sendResponse = new SendResponse(res);

  try {
    if ((req as any).user.active) {
      const updatesDetails = req.body;
      updatesDetails.photo = req.file
        ? req.file.filename
        : (req as any).user.photo;
      const userId = req.params.id;
      const updatedUser = await userModel
        .findByIdAndUpdate((req as any).user._id || userId, updatesDetails, {
          new: true,
          runValidators: true,
        })
        .select('-password');
      if (updatedUser) {
        sendResponse.sendJson(updatedUser, 'Your profile is updated', 200);
      }
    } else {
      return next(new AppError('User does not exist. Kindly sign up', 404));
    }
  } catch (err: any) {
    next(new AppError(err, 500));
  }
}

const logout = (req: Request, res: Response): Response => {
  return res
    .status(200)
    .json({ message: 'You have been successfully logged out' });
};

async function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await userModel
      .findOne({ email: req.body.email })
      .select('-password');
    if (!user) return next(new AppError('This user does not exist', 404));
    const resetToken = await user.createResetToken();
    const url: string = `https://briefly-26p0.onrender.com/resetPassword/${resetToken}`;
    const sendMail = new EmailSender();
    await sendMail.sendPasswordResetEmail(user, resetToken, url);
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: 'success',
      message: 'Your password reset token has been sent. Check your mailbox',
    });
  } catch (err: any) {
    new AppError(err, 500);
  }
}

async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resetToken = req.body.token || req.params.Token;
    const user = await userModel
      .findOne({
        resetPasswordToken: resetToken,
        resetTimeExp: { $gt: Date.now() },
      })
      .select('-password');
    if (!user) return next(new AppError('Invalid token or expired token', 404));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetTimeExp = undefined;

    await user.save();
    const token = await jwtToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'A new password has been set',
      token,
      user,
    });
  } catch (err: any) {
    new AppError(err, 500);
  }
}

export { signUp, updateProfile, login, logout, forgetPassword, resetPassword };
