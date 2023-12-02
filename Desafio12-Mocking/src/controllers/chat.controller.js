import { chatsModel } from "../models/chats.models.js";

export default class ChatController {
    constructor() { }

    async getAllMessages(req, res) {
        try {
            const messages = await chatsModel.find();
            res.status(200).send({
                message: "Get all messages successfully",
                messages,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: chats.controller.js:14 ~ ChatController ~ getAllMessages ~ error:",
                error
            );
            res.status(400).send({
                message: "error getting messages",
                error: error,
            });
        }
    }

    async addMessage(req, res) {
        const { user, message } = req.body;
        try {
            const newMessage = await chatsModel.create({ user, message });

            return res.status(200).send({
                messageStatus: `message added succesfully`,
                message: newMessage,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: chat.routes.js:41 ~ chatRoutes ~ this.router.post ~ error:",
                error
            );
            res.status(400).send({
                message: "error loading message",
                error: error,
            });
        }
    }
}