import shortId from 'shortid';
import { UrlModel } from '../model/shortenedUrl';
import AppError from '../utils/errorhandler';
import { Request, Response, NextFunction } from 'express';
import SendResponse from '../utils/sendResponse';

async function createShortUrl(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (!body) next(new AppError('Your Original Url Pls!', 400));
  body.shortUrl = shortId.generate();
  body.userId = (req as any).user;
  //   console.log(body);
  const newUrl: string = `${(req as any).protocol}://${(req as any).get(
    'host'
  )}/${body.shortUrl}`;

  try {
    const newDoc = await UrlModel.create(body);
    (res as any).status(201).json({ status: 'success', newUrl, newDoc });
  } catch (err: any) {
    next(new AppError(err, 500));
  }
}
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
    const findUrl: any = await UrlModel.findOne({
      shortUrl: req.params.shortId,
    });
    if (!findUrl.userId._Id === (req as any).user.id)
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );
    findUrl.shortUrl = req.body ? req.body.shortUrl : findUrl.shortUrl;
    await findUrl.save();
    res.status(200).json({
      status: 'success',
      message: 'You have updated this url',
      updatedUrl: findUrl,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}
async function deleteUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    const deleteUrl = UrlModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: 'success', message: 'You have deleted this Url' });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}
async function findAllMyUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    const allMyUrl: any = UrlModel.find({ _id: (req as any).user.id });
    if (!allMyUrl || allMyUrl.length === 0)
      return next(new AppError('No Url link was found!', 404));
    res.status(200).json({
      status: 'success',
      message: 'This is a list of Your Urls',
      size: allMyUrl.length,
      allMyUrl,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function findOneOfMyUrl(req: Request, res: Response, next: NextFunction) {
  try {
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    const myUrl: any = UrlModel.findOne({
      _id: (req as any).user.id,
      shortUrl: req.params.shortId,
    });
    if (!myUrl || myUrl.length === 0)
      return next(new AppError('No Url link was found!', 404));
    res.status(200).json({
      status: 'success',
      message: 'This is a list of Your Urls',
      size: myUrl.length,
      myUrl,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}
export {
  createShortUrl,
  RedirectUrl,
  updateUrl,
  findAllMyUrl,
  findOneOfMyUrl,
  deleteUrl,
};
