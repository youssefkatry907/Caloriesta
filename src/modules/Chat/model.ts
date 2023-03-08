import { ObjectId } from "mongoose";
import db from "../../database/mongo";
import { create } from "../Notifications/repo"

interface IChat extends db.Document {
    sender: ObjectId,
    receiver: ObjectId,
    message: object
}



const Chat: db.Schema<IChat> = new db.Schema(
    {
        sender: { type: db.SchemaTypes.ObjectId, ref: "User" },
        receiver: { type: db.SchemaTypes.ObjectId, ref: "User" },
        message: { type: String, required: true }
    },
    { timestamps: true }
);

Chat.post('save', async (chat) => {

    const form = {
        sender: chat.sender,
        receiver: chat.receiver,
        message: {
            title: "New message",
            text: `New message from ${chat.sender}`,
        }
    }
    await create(form)
})

export default db.model<IChat>("Chat", Chat);
