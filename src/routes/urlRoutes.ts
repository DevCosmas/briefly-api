import express from 'express';

import {
  createShortUrl,
  RedirectUrl,
  updateUrl,
  findAllMyUrl,
  findOneOfMyUrl,
  deleteUrl,
} from '../controller/UrlController';
import { isAuthenticated } from '../controller/authConroller';
import rateLimit from 'express-rate-limit';

const urlRouter = express.Router();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
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
urlRouter.get('/myUrls/:shortId', isAuthenticated, findOneOfMyUrl);
urlRouter.patch('/updateUrl/:shortId', isAuthenticated, updateUrl);
urlRouter.delete('/deleteUrl/:id', isAuthenticated, deleteUrl);
urlRouter.get('/:shortId', RedirectUrl);

export default urlRouter;
// const urlRouter = express.Router();
// urlRouter.post('/createUrl', isAuthenticated, createShortUrl);
// urlRouter.get('/findAll', isAuthenticated, findAllMyUrl);
// urlRouter.get('/myUrls/:shortId', isAuthenticated, findOneOfMyUrl);
// urlRouter.patch('/updateUrl/:shortId', isAuthenticated, updateUrl);
// urlRouter.delete('/deleteUrl/:id', isAuthenticated, deleteUrl);
// urlRouter.get('/:shortId', RedirectUrl);

// export default urlRouter;
