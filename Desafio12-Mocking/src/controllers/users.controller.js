import { UsersModel } from "../models/users.models.js";

export default class UserController {
    constructor() { }

    async getUsers(req, res) {
        try {
            const users = await UsersModel.find({});
            if (users) {
                return res.status(200).send({
                    message: "Get all users successfully",
                    users: users,
                });
            }
        } catch (error) {
            res.status(400).send({
                message: "error getting users",
                error: error,
            });
        }
    }

    async getUserById(req, res) {
        const { userId } = req.params;
        try {
            const user = await UsersModel.findById(userId);
            if (user) {
                res.status(200).send({
                    message: `get user info to id ${userId} successfully`,
                    user,
                });
            } else {
                res.status(404).send({
                    message: `user with id ${userId} not found`,
                });
            }
        } catch (error) {
            res.status(400).send({
                message: "error getting user",
                error: error,
            });
        }
    }

    async updateUserById(req, res) {
        const { userId } = req.params;
        const { first_name, last_name, age, email, password } = req.body;
        try {
            const user = await UsersModel.findByIdAndUpdate(userId, {
                first_name,
                last_name,
                age,
                email,
                password,
            });
            if (user) {
                return res.status(200).send({
                    message: `updated user`,
                    users: user,
                });
            } else {
                return res.status(404).send({
                    message: `user with id ${userId} not found`,
                });
            }
        } catch (error) {
            return res.status(400).send({
                message: "error updating user",
                error: error,
            });
        }
    }

    async deleteUserById(req, res) {
        const { userId } = req.params;
        try {
            const user = await UsersModel.findByIdAndDelete(userId);
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
            console.log(
                "🚀 ~ file: users.routes.js:124 ~ userRoutes ~ this.userRouter.put ~ error:",
                error
            );
            res.status(400).send({
                message: "error deleting user",
                error,
            });
        }
    }
}