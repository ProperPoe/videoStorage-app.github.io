"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_js_1 = __importDefault(require("../controllers/user.js"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.get("/find/:userId", user_js_1.default.getUser);
router.put("/", upload.single("profilePic"), user_js_1.default.updateUser);
exports.default = router;
