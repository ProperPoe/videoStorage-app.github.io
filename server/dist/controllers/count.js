"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { db } from "../connect";
const connects_1 = require("../connects");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class CountController {
    getCount(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "SELECT COUNT(*) AS notificationCount FROM notify WHERE toUserId = ?";
            connects_1.db.query(q, [userInfo.id], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    addCount(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "INSERT INTO notify (toUserId, postId, type, fromUserId) VALUES (?)";
            const values = [req.body.toUserId, req.body.postId, req.body.type, req.body.fromUserId];
            connects_1.db.query(q, [values], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json(data);
            });
        });
    }
    deleteCount(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Not logged in!");
            return;
        }
        jsonwebtoken_1.default.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            const q = "DELETE FROM notify WHERE postId = ? AND type = ? AND fromUserId = ?";
            const values = [req.query.postId, req.query.type, req.query.fromUserId];
            connects_1.db.query(q, values, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json(data);
            });
        });
    }
}
exports.default = new CountController();
