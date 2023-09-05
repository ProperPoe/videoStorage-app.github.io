"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connect_1 = require("../connect");
class NotifController {
    getNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "SELECT notifs.*, users.username FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ?";
            connect_1.db.query(q, [userInfo.id], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    addNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "INSERT INTO notifs (toUserId, fromUserId, postId, commentId, likeId, type) VALUES (?)";
            const values = [req.body.toUserId, req.body.fromUserId, req.body.postId, req.body.commentId, req.body.likeId, req.body.type];
            connect_1.db.query(q, [values], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    deleteNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            const q = "DELETE FROM notifs WHERE `fromUserId` = ? AND `postId` = ? AND `type` = 'like'";
            const values = [
                userInfo.id,
                req.query.postId
            ];
            connect_1.db.query(q, values, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Post has been unliked!");
            });
        });
    }
}
exports.default = new NotifController();
