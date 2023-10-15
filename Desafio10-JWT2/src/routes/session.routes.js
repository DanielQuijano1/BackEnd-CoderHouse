import { Router } from "express";
import UserManager from "../managers/usersManager.js";
import { createHashValue, validatePassword } from "../utils/bcrypt.js";
import passport from "passport";


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
        this.router.post(`${this.path}/login`, passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "incorrect data" })
                }
                req.session.user = {
                    role: req.user.role,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    age: req.user.age,
                }
                //res.status(200).json({payload: req.user})
                res.render("profile", {
                    role: req.session?.user?.role || user.role,
                    first_name: req.session?.user?.first_name || user.first_name,
                    last_name: req.session?.user?.last_name || user.last_name,
                    email: req.session?.user?.email || email,
                    age: req.session?.user?.age || user.age,
                });

            } catch (error) {
                res.status(500).json({
                    message: "Login error"
                })
            }
        })

        this.router.get(`${this.path}/logout`, async (req, res) => {
            if (req.session.user) {
                req.session.destroy((err) => {
                    if (!err) return res.redirect("/login");
                    return res.send({ message: `logout Error`, body: err });
                });
            }

        })

        this.router.post(`${this.path}/register`, passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
            try {
                res.status(200).redirect("/login")
            } catch (error) {
                console.log("file: session.routes.js:78 ~ SessionRoutes ~ this.router.post ~ error:", error)
                res.status(400).send({
                    message: "error creating user",
                    error: error,
                });

            }
        });


        this.router.post(`${this.path}/update`, async (req, res) => {
            try {
                const { old_password, new_password, repeat_new_password, email } = req.body

                const newPswHashed = createHashValue(new_password);
                const user = await this.userManager.findUserByEmail(email);
                //validando usuario
                if (!user) {
                    res.status(404).json({
                        message: "Incorrect data"
                    })
                }
                //validando contraseña
                const isValidComparePsw = validatePassword(old_password, user.password);
                if (!isValidComparePsw || new_password !== repeat_new_password) {
                    return res.status(401).json({ message: `incorrect data` });
                }

                const updateUser = this.userManager.updateUserById(user._id, {
                    password: newPswHashed,
                })

                if (!updateUser) {
                    res.json({
                        message: "error updating password"
                    })
                }
                return res.render('login');

            } catch (error) {
                console.log("file: session.routes.js:138 ~ router.post ~ error:", error)

            }
        })



        //***********registro ususario mediante GithubStrategi ***********/

        this.router.get(`${this.path}/github`, passport.authenticate('github', { scope: ['user:email'] }));

        //***********inicio sesión mediante GithubStrategi ***********/

        this.router.get(`${this.path}/github/callback`, passport.authenticate('github'), async (req, res) => {
            try {
                if (!req.user) {
                    return res.status(401).json({ message: "incorrect data" })
                }
                req.session.user = req.user
                res.render("profile", {
                    role: req.session?.user?.role || user.role,
                    first_name: req.session?.user?.first_name || user.first_name,
                    last_name: req.session?.user?.last_name || user.last_name,
                    email: req.session?.user?.email || email,
                    age: req.session?.user?.age || user.age,
                });

            } catch (error) {
                res.status(500).json({
                    message: "Login error"
                })
            }

        })

    }
}

export default SessionRoutes;