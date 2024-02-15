"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrl = exports.findOneOfMyUrl = exports.findAllMyUrl = exports.updateUrl = exports.RedirectUrl = exports.createShortUrl = void 0;
const shortid_1 = __importDefault(require("shortid"));
const shortenedUrl_1 = require("../model/shortenedUrl");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
function createShortUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        if (!body)
            next(new errorhandler_1.default('Your Original Url Pls!', 400));
        body.shortUrl = shortid_1.default.generate();
        body.userId = req.user;
        const newUrl = `${req.protocol}://${req.get('host')}/${body.shortUrl}`;
        try {
            const newDoc = yield shortenedUrl_1.UrlModel.create(body);
            res.status(201).json({ status: 'success', newUrl, newDoc });
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.createShortUrl = createShortUrl;
function RedirectUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const shortId = req.params.shortId;
            const shortenedUrlDoc = yield shortenedUrl_1.UrlModel.findOne({ shortUrl: shortId });
            console.log(shortenedUrlDoc);
            if (!shortenedUrlDoc) {
                return next(new errorhandler_1.default('No Url was found', 404));
            }
            if (shortenedUrlDoc.visitationCount === undefined ||
                shortenedUrlDoc.whoVisited === undefined ||
                shortenedUrlDoc.originalUrl === undefined) {
                return next(new errorhandler_1.default('Invalid Url Document', 500));
            }
            shortenedUrlDoc.visitationCount += 1;
            shortenedUrlDoc.whoVisited.push(req.ip);
            yield shortenedUrlDoc.save();
            res.redirect(shortenedUrlDoc.originalUrl);
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.RedirectUrl = RedirectUrl;
function updateUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user.active === true)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const findUrl = yield shortenedUrl_1.UrlModel.findOne({
                shortUrl: req.params.shortId,
            });
            if (!findUrl || findUrl === null)
                return next(new errorhandler_1.default('Nothing as found', 404));
            console.log(req.user._id);
            console.log(findUrl.userId._id);
            if (findUrl.userId._id.toString() !== req.user._id.toString())
                return next(new errorhandler_1.default('You are not authorized to perform this action', 401));
            findUrl.shortUrl = req.body ? req.body.shortUrl : findUrl.shortUrl;
            const newUrl = `${req.protocol}://${req.get('host')}/${findUrl.shortUrl}`;
            yield findUrl.save();
            res.status(200).json({
                status: 'success',
                message: 'You have updated this url',
                updatedUrl: findUrl,
                newUrl,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.updateUrl = updateUrl;
function deleteUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user.active === true)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const findUrl = yield shortenedUrl_1.UrlModel.findOne({
                _id: req.params.id,
            });
            if (!findUrl || findUrl === null)
                return next(new errorhandler_1.default('Nothing is found', 404));
            if (findUrl.userId._id.toString() !== req.user._id.toString())
                return next(new errorhandler_1.default('You are not authorized to perform this action', 401));
            const deleteUrl = shortenedUrl_1.UrlModel.deleteOne({ _id: req.params.id });
            res
                .status(200)
                .json({ status: 'success', message: 'You have deleted this Url' });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.deleteUrl = deleteUrl;
function findAllMyUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user.active === true)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const allMyUrl = yield shortenedUrl_1.UrlModel.find({ userId: req.user._id });
            if (!allMyUrl || allMyUrl.length === 0)
                return next(new errorhandler_1.default('No Url link was found!', 404));
            res.status(200).json({
                status: 'success',
                message: 'This is a list of Your Urls',
                size: allMyUrl.length,
                allMyUrl,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.findAllMyUrl = findAllMyUrl;
function findOneOfMyUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user.active === true)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const myUrl = yield shortenedUrl_1.UrlModel.findOne({
                userId: req.user._id,
                shortUrl: req.params.shortId,
            });
            if (!myUrl || myUrl.length === 0)
                return next(new errorhandler_1.default('No Url link was found!', 404));
            res.status(200).json({
                status: 'success',
                message: 'Here is Your Url link',
                size: myUrl.length,
                myUrl,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.findOneOfMyUrl = findOneOfMyUrl;
//# sourceMappingURL=UrlController.js.map