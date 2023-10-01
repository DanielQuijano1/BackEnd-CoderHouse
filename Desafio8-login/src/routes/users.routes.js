import { Router } from "express";
import UserManager from "../managers/usersManager.js"

class usersRoutes {
    path = "/users";
    router = Router();
    userManager;

    constructor() {
        this.userManager = new UserManager()
        this.initUsersRoutes();
    }
    initUsersRoutes() {
        this.router.get(`${this.path}`, async (req, res) => {
            try {
                const users = await this.userManager.getAllUsers()
                res.status(200).send({
                    message: "Get all users successfully",
                    users: users,
                });
            } catch (error) {
                console.log(
                    " file: users.routes.js:20 ~ userRoutes ~ this.userRouter.get ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error getting users",
                    error: error,
                });
            }
        });

        this.router.get(`${this.path}/:userId`, async (req, res) => {
            const { userId } = req.params;
            try {
                const user = await this.userManager.getUserById(userId);
                if (user) {
                    res.status(200).send({
                        message: `get user info to id ${userId} successfully`,
                        users: user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userId} not found`,
                    });
                }
            } catch (error) {
                console.log(
                    " file: users.routes.js:46 ~ this.userRouter.get ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error getting user",
                    error: error,
                });
            }
        });

        this.router.post(`${this.path}`, async (req, res) => {
            const { first_name, last_name, age, email, password } = req.body;
            try {
                const newUser = await this.userManager.addUser(
                    { first_name, last_name, age, email, password }
                );
                if (newUser) {
                    res.status(200).send({
                        message: "user loaded successfully",
                        users: newUser,
                    });
                } else {
                    res.status(400).send({
                        message: "Duplicate key error",
                    });
                }
            } catch (error) {
                console.log(
                    " file: users.routes.js:67 ~ this.userRouter.post ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error creating user",
                    error: error,
                });
            }
        });



        this.router.put(`${this.path}/:userId`, async (req, res) => {
            const { userId } = req.params;
            const { first_name, last_name, age, email, password } = req.body;
            try {
                const user = await this.userManager.updateUserById(userId, { first_name, last_name, age, email, password });
                if (user) {
                    res.status(200).send({
                        message: `updated user`,
                        users: user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userId} not found`,
                    });
                }
            } catch (error) {
                console.log(" file: users.routes.js:101 ~ usersRoutes ~ this.router.put ~ error:", error)
                res.status(400).send({
                    message: "error getting user",
                    error: error,
                });
            }
        });


        this.router.delete(`${this.path}/:userId`, async (req, res) => {
            const { userId } = req.params;
            try {
                const user = await this.userManager.deleteUserById(userId);
                if (user) {
                    res.status(200).send({
                        message: `user whith id ${userId} removed successfully`,
                        user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userId} not found`,
                    });
                }
            } catch (error) {
                console.log(" file: users.routes.js:124 ~ userRoutes ~ this.userRouter.put ~ error:", error)
                res.status(400).send({
                    message: "error deleting user",
                    error,
                });
            }
        });
    }
}


export default usersRoutes