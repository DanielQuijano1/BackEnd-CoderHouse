import { UsersModel } from "../models/users.models.js";

class UserManager {


    async getAllUsers() {
        try {
            const users = await UsersModel.find();
            return users
        } catch (error) {
            console.log("file: usersManager.js:10 ~ UserManager ~ getAllUsers ~ error:", error)
        }
    }

    async getUserById(userId) {
        try {
            const user = await UsersModel.findById(userId)
            return user
        } catch (error) {
            console.log("file: usersManager.js:19 ~ UserManager ~ getUserById ~ error:", error)
        }
    }

    async addUser({ first_name, last_name, age, email, password, role }) {
        try {
            const newUser = await UsersModel.create({ first_name, last_name, age, email, password, role });
            return newUser
        } catch (error) {
            console.log("file: usersManager.js:28 ~ UserManager ~ addUser ~ error:", error)
        }
    }

    async updateUserById(userId, { first_name, last_name, age, email, password }) {
        try {
            let updatedUser = await UsersModel.updateOne({ _id: userId }, { first_name, last_name, age, email, password })
            return updatedUser;
        } catch (error) {
            console.log("file: usersManager.js:38 ~ UserManager ~ updateUserById ~ error:", error)
        }
    }

    async deleteUserById(userId) {
        try {
            let result = await UsersModel.findByIdAndDelete(userId);
            return result;
        } catch (error) {
            console.log("file: usersManager.js:47 ~ UserManager ~ deleteUserById ~ error:", error)

        }
    }


    async findUserByEmail(email) {
        try {
            const user = await UsersModel.findOne(email)
            return user
        } catch (error) {
            console.log("file: usersManager.js:58 ~ UserManager ~ findUserByEmail ~ error:", error)

        }
    }
}

export default UserManager;