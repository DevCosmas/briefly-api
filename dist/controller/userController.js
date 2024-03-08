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
exports.reactivateAcct = exports.resetPassword = exports.forgetPassword = exports.logout = exports.login = exports.deleteAcct = exports.updateProfile = exports.signUp = void 0;
const user_1 = require("./../model/user");
const jwt_1 = require("./../utils/jwt");
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const email_1 = __importDefault(require("../utils/email"));
const sendResponse_1 = __importDefault(require("./../utils/sendResponse"));
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('we start here');
            const body = req.body;
            if (req.file)
                body.photo = req.file.filename;
            const newUser = yield user_1.userModel.create(body);
            if (!newUser) {
                return next(new errorhandler_1.default('Fill in the correct details please', 400));
            }
            const token = yield (0, jwt_1.jwtToken)(newUser._id);
            const sendMail = new email_1.default();
            yield sendMail.sendWelcomeEmail(newUser);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(201).json({
                result: 'SUCCESS',
                message: 'Sign up complete',
                token,
                user: newUser,
            });
            console.log('we end here');
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.signUp = signUp;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loginDetails = req.body;
            // Confirm if the user exists
            const isValidUser = yield user_1.userModel.findOne({ email: loginDetails.email });
            if (!isValidUser) {
                return next(new errorhandler_1.default('This user is not found. Kindly sign up', 404));
            }
            // Compare user password
            const isValidPassword = yield isValidUser.isValidPassword(loginDetails.password, isValidUser.password);
            if (!isValidPassword) {
                return next(new errorhandler_1.default('Invalid password or email', 401));
            }
            // Generate a token for use
            const token = yield (0, jwt_1.jwtToken)(isValidUser._id);
            res.status(200).json({
                result: 'SUCCESS',
                message: 'You are logged in now',
                token,
                user: isValidUser,
            });
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.login = login;
function updateProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new sendResponse_1.default(res);
        try {
            if (req.user.active === true) {
                const updatesDetails = req.body;
                updatesDetails.photo = req.file
                    ? req.file.filename
                    : req.user.photo;
                const updatedUser = yield user_1.userModel
                    .findByIdAndUpdate(req.user._id, updatesDetails, {
                    new: true,
                    runValidators: true,
                })
                    .select('-password');
                if (updatedUser) {
                    sendResponse.sendJson(updatedUser, 'Your profile is updated', 200);
                }
            }
            else {
                return next(new errorhandler_1.default('User does not exist. Kindly sign up', 404));
            }
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.updateProfile = updateProfile;
function deleteAcct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new sendResponse_1.default(res);
        try {
            const user = yield user_1.userModel.findById(req.user._id);
            user.active = false;
            yield user.save();
            if (user) {
                sendResponse.sendJson(user, 'Account deactivated successfully', 203);
            }
        }
        catch (err) {
            next(new errorhandler_1.default(err, 500));
        }
    });
}
exports.deleteAcct = deleteAcct;
const logout = (req, res) => {
    return res
        .status(200)
        .json({ message: 'You have been successfully logged out' });
};
exports.logout = logout;
function forgetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_1.userModel
                .findOne({ email: req.body.email })
                .select('-password');
            if (!user)
                return next(new errorhandler_1.default('This user does not exist', 404));
            const resetToken = yield user.createResetToken();
            console.log(resetToken);
            const url = `https://briefly-client.netlify.app/resetPassword/${resetToken}`;
            const sendMail = new email_1.default();
            yield sendMail.sendPasswordResetEmail(user, resetToken, url);
            yield user.save({ validateBeforeSave: false });
            res.status(200).json({
                message: 'Your password reset token has been sent. Check your mailbox',
            });
        }
        catch (err) {
            new errorhandler_1.default(err, 500);
        }
    });
}
exports.forgetPassword = forgetPassword;
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resetToken = req.params.Token;
            const user = yield user_1.userModel
                .findOne({
                resetPasswordToken: resetToken,
                resetTimeExp: { $gt: Date.now() },
            })
                .select('-password');
            if (!user)
                return next(new errorhandler_1.default('Invalid token or expired token', 404));
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetTimeExp = undefined;
            yield user.save();
            const token = yield (0, jwt_1.jwtToken)(user._id);
            res
                .status(200)
                .json({ message: 'A new password has been set', token, user });
        }
        catch (err) {
            new errorhandler_1.default(err, 500);
        }
    });
}
exports.resetPassword = resetPassword;
function reactivateAcct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new sendResponse_1.default(res);
        try {
            const user = yield user_1.userModel
                .findOne({ email: req.body.email })
                .select('-password');
            if (!user)
                next(new errorhandler_1.default('This user does not exist', 404));
            user.active = true;
            yield user.save();
            sendResponse.sendJson(user, `Welcome back ${user.username}. Your account has been re-activated`, 200);
        }
        catch (err) {
            new errorhandler_1.default(err, 500);
        }
    });
}
exports.reactivateAcct = reactivateAcct;
//# sourceMappingURL=userController.js.map