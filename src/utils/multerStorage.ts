import multer from 'multer';
import AppError from './errorhandler';
import { Request, Response, NextFunction } from 'express';

const multerStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, './dist/public/img/users');
  },
  filename: (req: Request, file: any, cb: any) => {
    console.log(file);
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Date.now()}.${ext}`);
  },
});

// const multerStorage=multer.memoryStorage()

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please Uploaad an image', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadPhoto = upload.single('photo');
export default uploadPhoto;
