"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("../connect");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthController {
    register(req, res) {
        //Check if user exists
        const q = "SELECT * FROM users WHERE username = ?";
        connect_1.db.query(q, [req.body.username], (err, data) => {
            if (err)
                return res.status(500).json(err);
            if (data.length)
                return res.status(409).json("User already exists");
            //Create a new user
            //Hash Password
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, salt);
            const q = "INSERT INTO users (`username`, `email`, `password`) VALUE (?)";
            const values = [req.body.username, req.body.email, hashedPassword];
            connect_1.db.query(q, [values], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                return res.status(200).json("User has been created!");
            });
        });
    }
    login(req, res) {
        res.send("it works!");
    }
    logout(req, res) {
        res.send("it works!");
    }
}
exports.default = new AuthController();
