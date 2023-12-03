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
const connects_1 = __importDefault(require("../connects"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
class CommentController {
    getComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = `SELECT comments.*, userId, username, profilePic FROM comments JOIN users ON (users.id = comments.userId) WHERE comments.postId = ? ORDER BY comments.createdAt DESC`;
                const [data] = yield connects_1.default.query(q, [req.query.postId]);
                res.status(200).json(data);
            }
            catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        });
    }
    postComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.accessToken;
            if (!token) {
                res.status(401).json("Not logged in");
                return;
            }
            try {
                const userInfo = jsonwebtoken_1.default.verify(token, "theKey");
                const q = "INSERT INTO comments (`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
                const values = [req.body.desc, (0, moment_1.default)(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id, req.body.postId];
                const [data] = yield connects_1.default.query(q, [values]);
                res.status(200).json("Comment created!");
            }
            catch (err) {
                console.error(err);
                res.status(500).json(err);
            }
        });
    }
}
exports.default = new CommentController();
