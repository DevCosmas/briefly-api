import shortId from 'shortid';
import { UrlModel } from '../model/shortenedUrl';
import AppError from '../utils/errorhandler';
import { Request, Response, NextFunction } from 'express';
import SendResponse from '../utils/sendResponse';
import client from '../redis';
import util from 'util';

async function RedirectUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const shortId: string = req.params.shortId;
    const shortenedUrlDoc = await UrlModel.findOne({ shortUrl: shortId });
    console.log(shortenedUrlDoc);
    if (!shortenedUrlDoc) {
      return next(new AppError('No Url was found', 404));
    }
    if (
      shortenedUrlDoc.visitationCount === undefined ||
      shortenedUrlDoc.whoVisited === undefined ||
      shortenedUrlDoc.originalUrl === undefined
    ) {
      return next(new AppError('Invalid Url Document', 500));
    }
    shortenedUrlDoc.visitationCount += 1;
    shortenedUrlDoc.whoVisited.push((req as any).ip);
    await shortenedUrlDoc.save();

    res.redirect(shortenedUrlDoc.originalUrl);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function updateUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    if (!req.body) return next(new AppError(`New name can't be blank`, 400));
    const findUrl: any = await UrlModel.findOne({
      shortUrl: req.params.shortId,
    });
    if (!findUrl || findUrl === null)
      return next(new AppError('Nothing is found', 404));

    if (findUrl.userId._id.toString() !== (req as any).user._id.toString())
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );
    findUrl.shortUrl = req.body ? req.body.shortUrl : findUrl.shortUrl;
    const newUrl: string = `${(req as any).protocol}://${(req as any).get(
      'host'
    )}/${findUrl.shortUrl}`;
    findUrl.newUrl = newUrl;
    await findUrl.save();
    res.status(200).json({
      status: 'success',
      message: 'update successfull',
      updatedUrl: findUrl,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function createShortUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.body;
    if (!body.originalUrl) next(new AppError('Your Original Url Pls!', 400));
    const existingLink = await UrlModel.findOne({
      userId: (req as any).user._id,
      originalUrl: body.originalUrl,
    });
    if (existingLink) {
      return next(new AppError('This link has been shortened', 400));
    } else {
      body.shortUrl = shortId.generate();
      body.userId = (req as any).user;
      const url: string = `${(req as any).protocol}://${(req as any).get(
        'host'
      )}/${body.shortUrl}`;
      body.newUrl = url;
      const newDoc = await UrlModel.create(body);
      res
        .status(201)
        .json({ status: 'success', message: 'New Link Created', newDoc });
    }
  } catch (err: any) {
    next(new AppError(err, 500));
  }
}

async function deleteUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    const findUrl: any = await UrlModel.findOne({
      _id: req.params.id,
    });
    if (!findUrl || findUrl === null)
      return next(new AppError('Url does not exist', 404));
    if (findUrl.userId._id.toString() !== (req as any).user._id.toString())
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );
    const deleteUrl = await UrlModel.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ status: 'success', message: 'You have deleted this Url' });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function findAllMyUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const userID = (req as any).user._id || req.query.id;

    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));

    const data = await UrlModel.find({ userId: userID }).sort({
      createdAt: -1,
    });

    if (!data || data.length === 0)
      return next(new AppError('No Url link was found!', 404));

    res.status(200).json({
      status: 'success',
      message: 'This is a list of Your Urls',
      size: data.length,
      data,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

export { createShortUrl, RedirectUrl, updateUrl, findAllMyUrl, deleteUrl };
