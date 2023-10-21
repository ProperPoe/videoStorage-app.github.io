import jwt from "jsonwebtoken";
import { db } from "../connect";
class NotifController {
    getNotif(req, res) {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json("Invalid token");
            return;
        }
        jwt.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "SELECT notifs.*, users.username, users.profilePic FROM notifs JOIN users ON users.id = notifs.fromUserId WHERE notifs.toUserId = ? ORDER BY createdAt DESC";
            db.query(q, [userInfo.id], (err, data) => {
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
        jwt.verify(token, "theKey", (err, userInfo) => {
            if (err)
                return res.status(403).json("User not logged in");
            const q = "INSERT INTO notifs (toUserId, fromUserId, postId, commentId, likeId, type) VALUES (?)";
            const values = [req.body.toUserId, req.body.fromUserId, req.body.postId, req.body.commentId, req.body.likeId, req.body.type];
            db.query(q, [values], (err, data) => {
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
        jwt.verify(token, "theKey", (err, userInfo) => {
            if (err) {
                return res.status(403).json("Token is not valid!");
            }
            const q = "DELETE FROM notifs WHERE `postId` = ? AND `fromUserId` = ?";
            const values = [req.query.postId, req.query.fromUserId];
            db.query(q, values, (err, data) => {
                if (err) {
                    return res.status(500).json(err);
                }
                return res.status(200).json("Notification has been deleted!");
            });
        });
    }
}
export default new NotifController();
