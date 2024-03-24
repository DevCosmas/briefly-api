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
exports.deleteUrl = exports.findAllMyUrl = exports.updateUrl = exports.RedirectUrl = exports.createShortUrl = void 0;
const shortid_1 = __importDefault(require("shortid"));
const shortenedUrl_1 = require("../model/shortenedUrl");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
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
            if (!req.user.active)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            if (!req.body)
                return next(new errorhandler_1.default(`New name can't be blank`, 400));
            const findUrl = yield shortenedUrl_1.UrlModel.findOne({
                shortUrl: req.params.shortId,
            });
            if (!findUrl || findUrl === null)
                return next(new errorhandler_1.default('Nothing is found', 404));
            if (findUrl.userId._id.toString() !== req.user._id.toString())
                return next(new errorhandler_1.default('You are not authorized to perform this action', 401));
            findUrl.shortUrl = req.body ? req.body.shortUrl : findUrl.shortUrl;
            const newUrl = `${req.protocol}://${req.get('host')}/${findUrl.shortUrl}`;
            findUrl.newUrl = newUrl;
            yield findUrl.save();
            res.status(200).json({
                status: 'success',
                message: 'update successfull',
                updatedUrl: findUrl,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.updateUrl = updateUrl;
function createShortUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            if (!body.originalUrl)
                next(new errorhandler_1.default('Your Original Url Pls!', 400));
            const existingLink = yield shortenedUrl_1.UrlModel.findOne({
                userId: req.user._id,
                originalUrl: body.originalUrl,
            });
            if (existingLink) {
                return next(new errorhandler_1.default('This link has been shortened', 400));
            }
            else {
                body.shortUrl = shortid_1.default.generate();
                body.userId = req.user._id;
                const url = `${req.protocol}://${req.get('host')}/${body.shortUrl}`;
                body.newUrl = url;
                const newDoc = yield shortenedUrl_1.UrlModel.create(body);
                res
                    .status(201)
                    .json({ status: 'success', message: 'New Link Created', newDoc });
            }
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.createShortUrl = createShortUrl;
function deleteUrl(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user.active === true)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const findUrl = yield shortenedUrl_1.UrlModel.findOne({
                _id: req.params.id,
            });
            if (!findUrl || findUrl === null)
                return next(new errorhandler_1.default('Url does not exist', 404));
            if (findUrl.userId._id.toString() !== req.user._id.toString())
                return next(new errorhandler_1.default('You are not authorized to perform this action', 401));
            const deleteUrl = yield shortenedUrl_1.UrlModel.deleteOne({ _id: req.params.id });
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
            const userID = req.user._id || req.query.id;
            if (!req.user.active)
                return next(new errorhandler_1.default('Login or Sign up again', 401));
            const data = yield shortenedUrl_1.UrlModel.find({ userId: userID }).sort({
                createdAt: -1,
            });
            if (!data || data.length === 0)
                return next(new errorhandler_1.default('No Url link was found!', 404));
            res.status(200).json({
                status: 'success',
                message: 'This is a list of Your Urls',
                size: data.length,
                data,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err.message, 500));
        }
    });
}
exports.findAllMyUrl = findAllMyUrl;
//# sourceMappingURL=UrlController.js.map