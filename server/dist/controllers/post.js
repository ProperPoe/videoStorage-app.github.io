"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../connect");
class PostController {
    getPost(req, res) {
        const q = `SELECT posts.*, userId, username FROM posts JOIN users ON (users.id = posts.userId)`;
        connect_1.db.query(q, (err, data) => {
            if (err)
                return res.status(500).json(err);
            return res.status(200).json(data);
        });
    }
}
exports.default = new PostController();
