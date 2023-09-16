import { Router } from "express";
import { chatsModel } from "../models/chats.models.js";

class chatRoutes {
    path = "/chat";
    router = Router();

    constructor() {
        this.initChatRoutes();
    }
    initChatRoutes() {
        this.router.get(`${this.path}`, async (req, res) => {
            try {
                const messages = await chatsModel.find();
                res.status(200).send({
                    message: "Get all messages successfully",
                    messages,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: chatRoutes ~ this.router.get ~ error:",
                    error
                );
                res.status(400).send({
                    message: "error getting messages",
                    error: error,
                });
            }
        });

        this.router.post(`${this.path}`, async (req, res) => {
            const { user, message } = req.body
            try {
                const newMessage = await chatsModel.create({ user, message });

                return res.status(200).send({
                    messageStatus: `message added succesfully`,
                    message: newMessage,
                });
            } catch (error) {
                console.log("🚀 ~ file: chatRoutes ~ this.router.post ~ error:", error)
                res.status(400).send({
                    message: "error loading messages",
                    error: error,
                });
            }
        })

    }
}

export default chatRoutes;