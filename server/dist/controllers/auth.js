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
import { db } from "../connect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
class AuthController {
    register(req, res) {
        return new Promise((resolve, reject) => {
            if (!req.body.username || !req.body.email || !req.body.password) {
                return res.status(400).json("All fields required");
            }
            //Check if user exists
            const q = "SELECT * FROM users WHERE username = ?";
            db.query(q, [req.body.username], (err, data) => {
                if (err)
                    return res.status(500).json(err);
                if (data.length)
                    return res.status(409).json("User already exists");
                //Create a new user
                //Hash Password
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.password, salt);
                const q = "INSERT INTO users (`username`, `email`, `password`) VALUE (?)";
                const values = [req.body.username, req.body.email, hashedPassword];
                db.query(q, [values], (err, data) => {
                    if (err)
                        return res.status(500).json(err);
                    return res.status(200).json("User has been created!");
                });
            });
        });
    }
    login(req, res) {
        const q = "SELECT * FROM users WHERE username = ?";
        db.query(q, [req.body.username], (err, data) => {
            if (err)
                return res.status(500).json(err);
            if (data.length === 0)
                return res.status(404).json("No such user exists!");
            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
            if (!checkPassword)
                return res.status(400).json("Incorrect credentials");
            const token = jwt.sign({ id: data[0].id }, "theKey");
            const _a = data[0], { password } = _a, others = __rest(_a, ["password"]);
            res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
        });
    }
    logout(req, res) {
        res.clearCookie("accessToken", {
            secure: true,
            sameSite: "none"
        }).status(200).json("User is logged out");
    }
}
export default new AuthController();
