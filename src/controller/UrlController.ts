import shortId from 'shortid';
import { UrlModel } from '../model/shortenedUrl';
import AppError from '../utils/errorhandler';
import { Request, Response, NextFunction } from 'express';
import SendResponse from '../utils/sendResponse';
import client from '../redis';
import util from 'util';

// client.set = util.promisify(client.set).bind(client.set);
// client.get = util.promisify(client.get).bind(client.get);

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
    if (!findUrl || findUrl === null)
      return next(new AppError('Nothing as found', 404));
    console.log((req as any).user._id);
    console.log(findUrl.userId._id);
    if (findUrl.userId._id.toString() !== (req as any).user._id.toString())
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );
    findUrl.shortUrl = req.body ? req.body.shortUrl : findUrl.shortUrl;
    const newUrl: string = `${(req as any).protocol}://${(req as any).get(
      'host'
    )}/${findUrl.shortUrl}`;
    await findUrl.save();
    res.status(200).json({
      status: 'success',
      message: 'You have updated this url',
      updatedUrl: findUrl,
      newUrl,
    });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function createShortUrl(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (!body) next(new AppError('Your Original Url Pls!', 400));
  body.shortUrl = shortId.generate();
  body.userId = (req as any).user;
  const url: string = `${(req as any).protocol}://${(req as any).get('host')}/${
    body.shortUrl
  }`;
  body.newUrl = url;
  try {
    const newDoc = await UrlModel.create(body);
    (res as any).status(201).json({ status: 'success', newDoc });
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
      return next(new AppError('Nothing is found', 404));
    if (findUrl.userId._id.toString() !== (req as any).user._id.toString())
      return next(
        new AppError('You are not authorized to perform this action', 401)
      );
    const deleteUrl = UrlModel.deleteOne({ _id: req.params.id });
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

    const cachedUrl: any = await client.get(`myUrl-${(req as any).user.id}`);
    if (cachedUrl) {
      const sendResponse = new SendResponse(res);
      sendResponse.sendJson(
        JSON.parse(cachedUrl),
        'This is a list of Your Urls',
        200
      );
    } else {
      const allMyUrl = await UrlModel.find({ userId: (req as any).user._id });
      if (!allMyUrl || allMyUrl.length === 0)
        return next(new AppError('No Url link was found!', 404));

      await client.set(
        `myUrl-${(req as any).user.id}`,
        JSON.stringify(allMyUrl)
      );
      await client.expire(`myUrl-${(req as any).user.id}`, 3600);

      console.log('we reached here');
      res.status(200).json({
        status: 'success',
        message: 'This is a list of Your Urls',
        size: allMyUrl.length,
        allMyUrl,
      });
    }
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
}

async function findOneOfMyUrl(req: Request, res: Response, next: NextFunction) {
  try {
    console.log((req as any).user);
    if (!(req as any).user.active === true)
      return next(new AppError('Login or Sign up again', 401));
    const cachedUrl: any = await client.get(`oneUrl-${(req as any).user.id}`);
    // console.log(JSON.parse(cachedUrl));
    console.log('data is cached');
    if (cachedUrl) {
      const sendResponse = new SendResponse(res);
      sendResponse.sendJson(
        JSON.parse(cachedUrl),
        'This is a list of Your Urls',
        200
      );
    } else {
      const myUrl: any = await UrlModel.findOne({
        userId: (req as any).user._id,
        shortUrl: req.params.shortId,
      });
      if (!myUrl || myUrl.length === 0)
        return next(new AppError('No Url link was found!', 404));
      await client.set(`oneUrl-${(req as any).user.id}`, JSON.stringify(myUrl));
      await client.expire(`oneUrl-${(req as any).user.id}`, 3600);
      res.status(200).json({
        status: 'success',
        message: 'Here is Your Url link',
        size: myUrl.length,
        myUrl,
      });
    }
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
