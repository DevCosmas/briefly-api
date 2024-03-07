"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UrlController_1 = require("../controller/UrlController");
const authConroller_1 = require("../controller/authConroller");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const urlRouter = express_1.default.Router();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 1,
});
urlRouter.use((req, res, next) => {
    if (req.path !== '/findAll') {
        limiter(req, res, next);
    }
    else {
        next();
    }
});
urlRouter.post('/createUrl', authConroller_1.isAuthenticated, UrlController_1.createShortUrl);
urlRouter.get('/findAll', authConroller_1.isAuthenticated, UrlController_1.findAllMyUrl);
urlRouter.get('/myUrls/:shortId', authConroller_1.isAuthenticated, UrlController_1.findOneOfMyUrl);
urlRouter.patch('/updateUrl/:shortId', authConroller_1.isAuthenticated, UrlController_1.updateUrl);
urlRouter.delete('/deleteUrl/:id', authConroller_1.isAuthenticated, UrlController_1.deleteUrl);
urlRouter.get('/:shortId', UrlController_1.RedirectUrl);
exports.default = urlRouter;
// const urlRouter = express.Router();
// urlRouter.post('/createUrl', isAuthenticated, createShortUrl);
// urlRouter.get('/findAll', isAuthenticated, findAllMyUrl);
// urlRouter.get('/myUrls/:shortId', isAuthenticated, findOneOfMyUrl);
// urlRouter.patch('/updateUrl/:shortId', isAuthenticated, updateUrl);
// urlRouter.delete('/deleteUrl/:id', isAuthenticated, deleteUrl);
// urlRouter.get('/:shortId', RedirectUrl);
// export default urlRouter;
//# sourceMappingURL=urlRoutes.js.map