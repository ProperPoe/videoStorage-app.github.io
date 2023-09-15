"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_js_1 = __importDefault(require("../controllers/post.js"));
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.get("/", post_js_1.default.getPost);
router.post("/", upload.single("media"), post_js_1.default.addPost);
router.delete("/:id", post_js_1.default.deletePost);
router.put("/:id", post_js_1.default.updatePost);
router.get('/user/:userId', post_js_1.default.getPostsByUser);
exports.default = router;
