import { Router } from "express";
import UserManager from "../managers/usersManager.js";


//Verifico si el usuario es admin o no
const auth = (req, res, next) => {
    if (req.session.email == "admin@admin.com" && req.session.password == "1234") {
        return next() //Continua con la siguiente ejecucion
    }

    res.send("No tenes acceso a esta ruta")
}

class SessionRoutes {
    path = "/session"
    router = Router();
    userManager;

    constructor() {
        this.userManager = new UserManager();
        this.initSessionRoutes();
    }
    initSessionRoutes() {
        this.router.post(`${this.path}/login`, async (req, res) => {
            const { email, password } = req.body;
            try {
                if (req.session.login) {
                    res.status(200).json({ message: "Session already started" })
                }
                const user = await this.userManager.findUserByEmail(email)
                if (user) {
                    if (user.password == password) {
                        req.session.login = true
                        // res.status(200).send({
                        //     message: "Logging in",
                        //     user,
                        // })
                        req.session.user = {
                            ...user,
                        };

                        res.render("profile", {
                            role: req.session?.user?.role || user.role,
                            first_name: req.session?.user?.first_name || user.first_name,
                            last_name: req.session?.user?.last_name || user.last_name,
                            email: req.session?.user?.email || email,
                            age: req.session?.user?.age || user.age,
                        });
                    } else {
                        res.status(401).json({
                            message: "incorrect data"
                        })
                    }
                } else {
                    res.status(404).json({
                        message: "The user is not registered",
                    });
                }
            } catch (error) {
                console.log("🚀 ~ file: session.routes.js:51 ~ SessionRoutes ~ this.router.post ~ error:", error)
                res.status(400).json({
                    message: "Login error",
                    error: error,
                });
            }
        })

        this.router.get(`${this.path}/logout`, async (req, res) => {
            if (req.session.login) {
                req.session.destroy((err) => {
                    if (!err) return res.redirect("/login");
                    return res.send({ message: `logout Error`, body: err });
                });
            }

        })

    }
}

export default SessionRoutes;