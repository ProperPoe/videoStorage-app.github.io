"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../connect");
class UserController {
    getUser(req, res) {
        const userId = req.params.userId;
        const q = "SELECT * FROM users WHERE id=?";
        connect_1.db.query(q, [userId], (err, data) => {
            if (err)
                return res.status(500).json(err);
            const _a = data[0], { password } = _a, info = __rest(_a, ["password"]);
            return res.json(info);
        });
    }
}
exports.default = new UserController();
