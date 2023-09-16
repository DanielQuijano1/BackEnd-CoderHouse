import { Schema, model } from "mongoose";

const chatsSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    postTime: {
        type: Date,
        default: Date.now,
    }
});

export const chatsModel = model("chats", chatsSchema);