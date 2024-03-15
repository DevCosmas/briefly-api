import express from 'express';

import {
  createShortUrl,
  RedirectUrl,
  updateUrl,
  findAllMyUrl,
  deleteUrl,
} from '../controller/UrlController';
import { isAuthenticated } from '../controller/authConroller';
import rateLimit from 'express-rate-limit';

const urlRouter = express.Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 1000,
});

urlRouter.use((req, res, next) => {
  if (req.path !== '/findAll') {
    limiter(req, res, next);
  } else {
    next();
  }
});

urlRouter.post('/createUrl', isAuthenticated, createShortUrl);
urlRouter.get('/findAll', isAuthenticated, findAllMyUrl);
urlRouter.patch('/updateUrl/:shortId', isAuthenticated, updateUrl);
urlRouter.delete('/deleteUrl/:id', isAuthenticated, deleteUrl);
urlRouter.get('/:shortId', RedirectUrl);

export default urlRouter;
