"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PostController {
    getPost(req, res) {
        res.send("it works!");
    }
}
exports.default = new PostController();
