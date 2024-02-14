"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UrlController_1 = require("../controller/UrlController");
const authConroller_1 = require("../controller/authConroller");
const urlRouter = express_1.default.Router();
urlRouter.post('/createUrl', authConroller_1.isAuthenticated, UrlController_1.createShortUrl);
urlRouter.get('/:shortId', UrlController_1.RedirectUrl);
exports.default = urlRouter;
//# sourceMappingURL=urlRoutes.js.map