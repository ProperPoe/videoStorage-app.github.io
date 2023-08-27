"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    getUser(req, res) {
        res.send("it works!");
    }
}
exports.default = new UserController();
