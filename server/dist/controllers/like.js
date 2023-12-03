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
// import { db } from "../connect";
const connects_1 = __importDefault(require("../connects"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LikeController {
    getLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = "SELECT userId FROM likes WHERE postId = ?";
                const [rows] = yield connects_1.default.query(q, [req.query.postId]);
                const userIds = rows.map((like) => like.userId);
                res.status(200).json(userIds);
                return;
            }
            catch (err) {
                console.error("Error fetching likes:", err);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    addLikes(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).json("Token is not valid!");
                return;
            }
            try {
                const q = "INSERT INTO likes(`userId`, `postId`) VALUES (?, ?)";
                const values = [userInfo.id, req.body.postId];
                const [data] = yield connects_1.default.query(q, values);
                res.status(200).json("Post has been liked!");
            }
            catch (error) {
                res.status(500).json(error);
            }
        }));
    }
    deleteLikes(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(403).json("Token is not valid!");
                return;
            }
            try {
                const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
                const values = [userInfo.id, req.query.postId];
                const [data] = yield connects_1.default.query(q, values);
                res.status(200).json("Post has been unliked!");
            }
            catch (error) {
                res.status(500).json(error);
            }
        }));
    }
}
exports.default = new LikeController();
