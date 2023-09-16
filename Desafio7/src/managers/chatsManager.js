import { chatsModel } from "../models/chats.models.js";

class ChatsManager {

    async getAllMessages (){
        try {
            const messages = await chatsModel.find()
            return messages;
        } catch (error) {
            console.log("🚀 ~ file: ChatsManager ~ getAllMessages ~ error:", error)
            
        }
    }

    async addMessage({user, message, postTime}){
        try {
            const newMessage = await chatsModel.create({user, message, postTime});
            return newMessage;
        } catch (error) {
            console.log("🚀 ~ file: ChatsManager ~ addMessage ~ error:", error)
            
        }
    }

}

export default ChatsManager;