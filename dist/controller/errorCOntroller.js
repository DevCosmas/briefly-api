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
const { userModel } = require('./../model/user');
const { jwtToken } = require('./../utils/jwt');
const appError = require('../utils/errorhandler');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const SendResponse = require('../utils/sendJsonResponse');
function signUp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = req.body;
            const newUser = yield userModel.create(body);
            if (!newUser) {
                return next(new appError('fill in the correct details pls', 400));
            }
            const token = yield jwtToken(newUser._id);
            const message = `Hey ${newUser.firstname}, we are excited to have you on board with us .\n kindly confirm your email.`;
            yield sendEmail(message, newUser);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(201).json({
                result: 'SUCCESS',
                Message: 'You have succesfully signed Up',
                token,
                userProfile: newUser,
            });
        }
        catch (err) {
            next(new appError(err, 500));
        }
    });
}
function Login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loginDetails = req.body;
            // confirm if user exist
            const isValidUser = yield userModel.findOne({ email: loginDetails.email });
            if (!isValidUser) {
                return next(new appError('this user is not found. kindly sign up', 404));
            }
            // compare user password
            const isValidPassowrd = yield isValidUser.isValidPassword(loginDetails.password, isValidUser.password);
            if (!isValidPassowrd) {
                return next(new appError('invalid password or email', 401));
            }
            // generate a token for use
            const token = yield jwtToken(isValidUser._id);
            res.cookie('jwt', token, { httpOnly: true });
            res.status(200).json({
                result: 'SUCCESS',
                Message: 'You are logged in now',
                token,
                user: isValidUser,
            });
        }
        catch (err) {
            next(new appError(err, 500));
        }
    });
}
function updateProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new SendResponse(res);
        try {
            if (req.user.active === true) {
                const updatesDetails = req.body;
                const updatedUser = userModel.findByIdAndUpdate(req.user, updatesDetails, { new: true, runValidators: true });
                if (updatedUser)
                    sendResponse.sendJson(updatedUser, 'Your profile is updated', 200);
            }
            else {
                return next(new appError('User does not exist kindly signUp', 404));
            }
        }
        catch (err) {
            next(new appError(err, 500));
        }
    });
}
function deleteAcct(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sendResponse = new SendResponse(res);
        try {
            const user = yield userModel.findById(req.user.id).select('-password');
            user.active = false;
            yield user.save();
            if (user)
                sendResponse.sendJson(user, 'Account deletion successful', 203);
        }
        catch (err) {
            next(new appError(err, 500));
        }
    });
}
const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
    });
    return res
        .status(200)
        .json({ message: 'You have been successfully logged out' });
};
const forgetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.findOne({ email: req.body.email });
        if (!user)
            return next(new appError('this user does not exist', 404));
        const resetToken = yield user.createResetToken();
        console.log(resetToken);
        const emailMessage = `hey ${user.firstname} your passowrd reset code is :${resetToken}.\n
kindly click on the url to reset your password at ${req.protocol}://${req.get('host')}/resetPassowrd/${resetToken}`;
        yield sendEmail(emailMessage, user);
        yield user.save({ validateBeforeSave: false });
        res.status(200).json({
            message: 'your password reset token has been sent. check your mail box',
        });
    }
    catch (err) {
        new appError(err, 500);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedToken = yield crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');
        const user = yield userModel.findOne({
            resetPasswordToken: hashedToken,
            resetTimeExp: { $gt: Date.now() },
        });
        if (!user)
            return next(new appError('invalid token or expired token', 404));
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetTimeExp = undefined;
        yield user.save();
        const token = yield jwtToken(user._id);
        res.cookie('jwt', token, { httpOnly: true });
        res
            .status(200)
            .json({ message: 'a new pasword has been set', token, user });
    }
    catch (err) {
        new appError(err, 500);
    }
});
const reactivateAcct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sendResponse = new SendResponse(res);
    try {
        const user = yield userModel
            .findOne({ email: req.body.email })
            .select('-password');
        if (!user)
            next(new appError('this user does not exist', 404));
        user.active = true;
        const message = `Hey ${user.firstname}, we are excited to have you on board with us .\n kindly confirm your email.`;
        yield sendEmail(message, user);
        yield user.save();
        sendResponse.sendJson(user, `welcome back ${user.username}. your account has been re-activated`, 200);
    }
    catch (err) {
        new appError(err, 500);
    }
});
module.exports = {
    signUp,
    updateProfile,
    deleteAcct,
    Login,
    logout,
    forgetPassword,
    resetPassword,
    reactivateAcct,
};
//# sourceMappingURL=errorCOntroller.js.map