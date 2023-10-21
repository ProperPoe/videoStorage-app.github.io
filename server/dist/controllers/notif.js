"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { db } from "../connect";
const connects_1 = require("../connects");
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
            const q = "SELECT notifs.*, users.username, users.profilePic FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ? ORDER BY createdAt DESC";
            connects_1.db.query(q, [userInfo.id], (err, data) => {
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
            connects_1.db.query(q, [values], (err, data) => {
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
            const q = "DELETE FROM notifs WHERE `postId` = ? AND `fromUserId` = ?";
            const values = [req.query.postId, req.query.fromUserId];
            connects_1.db.query(q, values, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Notification has been deleted!");
            });
        });
    }
}
exports.default = new NotifController();
