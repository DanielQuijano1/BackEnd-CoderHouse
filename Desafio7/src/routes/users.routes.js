import { Router } from "express";
import { usersModel } from "../models/users.models.js";

class usersRoutes {
    path = "/users";
    router = Router();

    constructor() {
        this.initUsersRoutes();
    }
    initUsersRoutes() {
        this.router.get(`${this.path}`, async (req, res) => {
            try {
                const users = await usersModel.find();
                res.status(200).send({
                    message: "Get all users successfully",
                    users: users,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file:     userRoutes ~ this.userRouter.get ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error getting users",
                    error: error,
                });
            }
        });

        this.router.get(`${this.path}/:userID`, async (req, res) => {
            const { userID } = req.params;
            try {
                const user = await usersModel.findById(userID);
                if (user) {
                    res.status(200).send({
                        message: `get user info to id ${userID} successfully`,
                        users: user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userID} not found`,
                    });
                }
            } catch (error) {
                console.log(
                    "🚀 ~ file: this.userRouter.get ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error getting user",
                    error: error,
                });
            }
        });

        this.router.post(`${this.path}`, async (req, res) => {
            const { firstName, lastName, age, email, password } = req.body;
            try {
                const newUser = await usersModel.create({
                    firstName,
                    lastName,
                    age,
                    email,
                    password,
                });
                res.status(200).send({
                    message: "user loaded successfully",
                    users: newUser,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: this.userRouter.post ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error creating user",
                    error: error,
                });
            }
        });



        this.router.put(`${this.path}/:userID`, async (req, res) => {
            const { userID } = req.params;
            const { firstName, lastName, age, email, password } = req.body;
            try {
                const user = await usersModel.findByIdAndUpdate(userID, { firstName, lastName, age, email, password });
                if (user) {
                    res.status(200).send({
                        message: `updated user`,
                        users: user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userID} not found`,
                    });
                }
            } catch (error) {
                console.log("🚀 ~ file: usersRoutes ~ this.router.put ~ error:", error)
                res.status(400).send({
                    message: "error getting user",
                    error: error,
                });
            }
        });


        this.router.delete(`${this.path}/:userID`, async (req, res) => {
            const { userID } = req.params;
            try {
                const user = await usersModel.findByIdAndDelete(userID);
                if (user) {
                    res.status(200).send({
                        message: `user whith id ${userID} removed successfully`,
                        users: user,
                    });
                } else {
                    res.status(404).send({
                        message: `user with id ${userID} not found`,
                    });
                }
            } catch (error) {
                console.log("🚀 ~ file: userRoutes ~ this.userRouter.put ~ error:", error)
                res.status(400).send({
                    message: "error deleting user",
                    error: error,
                });
            }
        });
    }
}


export default usersRoutes