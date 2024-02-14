import express from 'express';
import { createShortUrl, RedirectUrl } from '../controller/UrlController';
import { isAuthenticated } from '../controller/authConroller';

const urlRouter = express.Router();
urlRouter.post('/createUrl', isAuthenticated, createShortUrl);
urlRouter.get('/:shortId', RedirectUrl);

export default urlRouter;
