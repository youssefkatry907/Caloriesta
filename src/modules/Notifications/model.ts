//from , to ,message
//Ex : from user(userId) to (userID) [restaurant-consultant], message : [] 
import { ObjectId } from "mongoose";
import db from "../../database/mongo";

interface INotification extends db.Document {
    sender: ObjectId,
    receiver: ObjectId,
    message: object,
    isOpened : Boolean,
    date: Date
}

const Notification: db.Schema<INotification> = new db.Schema(
    {
        sender: { type: db.SchemaTypes.ObjectId, ref: "User" },
        receiver: { type: db.SchemaTypes.ObjectId, ref: "User" },
        message: {
            title: String,
            text: String
        },
        isOpened: { type: Boolean, default: false },
        date: Date
    },
    { timestamps: true },
);




export default db.model<INotification>("Notification", Notification);
