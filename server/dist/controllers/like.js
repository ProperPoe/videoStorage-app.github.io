"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { db } from "../connect";
const connects_1 = require("../connects");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LikeController {
    getLikes(req, res) {
        const q = "SELECT userId FROM likes WHERE postId = ?";
        connects_1.db.query(q, [req.query.postId], (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data.map(like => like.userId));
        });
    }
    addLikes(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            const q = "INSERT INTO likes(`userId`, `postId`) VALUES (?)";
            const values = [
                userInfo.id,
                req.body.postId
            ];
            connects_1.db.query(q, [values], (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Post has been liked!");
            });
        });
    }
    deleteLikes(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
            const values = [
                userInfo.id,
                req.body.postId
            ];
            connects_1.db.query(q, [userInfo.id, req.query.postId], (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Post has been unliked!");
            });
        });
    }
}
exports.default = new LikeController();
