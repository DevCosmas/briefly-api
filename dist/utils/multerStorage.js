"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const errorhandler_1 = __importDefault(require("./errorhandler"));
const multerStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './dist/public/img/users');
    },
    filename: (req, file, cb) => {
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${Date.now()}.${ext}`);
    },
});
// const multerStorage=multer.memoryStorage()
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new errorhandler_1.default('Not an image. Please Uploaad an image', 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
const uploadPhoto = upload.single('photo');
exports.default = uploadPhoto;
//# sourceMappingURL=multerStorage.js.map