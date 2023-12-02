import { UsersModel } from "../models/users.models.js";
import { createHashValue, validatePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export default class SessionsController {
    constructor() { }

    async postLogin(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "incorrect data" });
            } else {
                req.session.user = {
                    role: req.user.role,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    age: req.user.age,
                };
                const token = generateToken(req.user);
                res.cookie("cookieToken", token, {
                    maxAge: 43200000, //tiempo de expiración en milisegundos??? => sería 12 hs
                    httpOnly: true,
                });
                //res.status(200).json({ message: "login success", payload: req.user });
                res.status(200).render("profile", {
                    role: req.session?.user?.role || user.role,
                    first_name: req.session?.user?.first_name || user.first_name,
                    last_name: req.session?.user?.last_name || user.last_name,
                    email: req.session?.user?.email || email,
                    age: req.session?.user?.age || user.age,
                });
            }
        } catch (error) {
            res.status(500).json({
                message: "Login error",
            });
        }
    }
    async getLogout(req, res) {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (!err) return res.redirect("/login");
                res.send({ message: `logout Error`, body: err });
            });
        }
        res.clearCookie("cookieToken");
    }

    async postRegister(req, res) {
        try {
            res.status(200).redirect("/login");
        } catch (error) {
            console.log("🚀 ~ file: sessions.controller.js:54 ~ SessionsController ~ postRegister ~ error:", error)
            res.status(400).send({
                message: "error creating user",
                error: error,
            });
        }
    }

    async postUpdatePassword(req, res) {
        try {
            const { old_password, new_password, repeat_new_password, email } =
                req.body;

            const newPswHashed = createHashValue(new_password);
            const user = await UsersModel.findOne(email);
            //validando usuario
            if (!user) {
                res.status(404).json({
                    message: "Incorrect data",
                });
            }
            //validando contraseña
            const isValidComparePsw = validatePassword(old_password, user.password);
            if (!isValidComparePsw || new_password !== repeat_new_password) {
                return res.status(401).json({ message: `incorrect data` });
            }

            const updateUser = UsersModel.findByIdAndUpdate(user._id, {
                password: newPswHashed,
            });

            if (!updateUser) {
                res.json({
                    message: "error updating password",
                });
            }
            return res.render("login");
        } catch (error) {
            console.log(
                "🚀 ~ file: session.routes.js:138 ~ router.post ~ error:",
                error
            );
        }
    }

    async getGithubCallback(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "incorrect data" });
            }
            req.session.user = req.user;
            res.render("profile", {
                role: req.session?.user?.role || user.role,
                first_name: req.session?.user?.first_name || user.first_name,
                last_name: req.session?.user?.last_name || user.last_name,
                email: req.session?.user?.email || email,
                age: req.session?.user?.age || user.age,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: session.routes.js:146 ~ SessionRoutes ~ this.router.get ~ error:",
                error
            );
            res.status(500).json({
                message: "Login error",
            });
        }
    }
}