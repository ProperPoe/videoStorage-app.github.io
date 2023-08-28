"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../connect");
class CommentController {
    getComment(req, res) {
        const token = req.cookies.accessToken;
        const q = `SELECT comments.*, userId, username FROM comments JOIN users ON (users.id = comments.userId) WHERE comments.postId = ? ORDER BY comments.createdAt DESC`;
        connect_1.db.query(q, [req.query.postId], (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json(data);
        });
    }
    ;
}
exports.default = new CommentController();
