"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommentController {
    getComment(req, res) {
        res.send("it works!");
    }
}
exports.default = new CommentController();
