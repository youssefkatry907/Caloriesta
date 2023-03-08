// create server
import app from "./app";
import { create as createMessage, list as listMessages, remove as removeMessage } from "../modules/Chat/repo";
import {
    list as listNotifications, create as createNotification,
    remove as removeNotification
} from "../modules/Notifications/repo"
import Notification from "../modules/Notifications/model"



const port = 9000;
const host = "127.0.0.1";

let server = app.listen(port, host, () => {
    console.log(`Server is up and running on ${host}:${port}`);
});

var io = require('socket.io')(server);
io.on('connection', function (socket) {

    //Chats
    socket.on('sendMessage', async (msg) => {
        await createMessage(msg);
        io.emit('sendMessage', msg);
        console.log(msg);
    });

    socket.on('deleteMessage', async (msg) => {
        const result = await removeMessage(msg.messageId);
        io.emit('deleteMessage', "message deleted");
    })

    socket.on('listMessages', async (receiver) => { // list
        const messages = await listMessages({ receiver: receiver.userId });
        io.emit('listMessages', messages); //listen , msg ==> receiver, text
        console.log(messages);
    });


    //Notifications
    socket.on('createNotification', async (notification) => {
        await createNotification(notification)
        io.emit('createNotification', notification)
        console.log(notification)
    })

    socket.on('notifications', async (receiver) => {

        const notifications = await listNotifications({ receiver: receiver.userId })
        if (notifications.length > 0) {
            io.emit('notification', notifications);
            Notification.updateMany({ isOpened: true, receiver: receiver.userId })
            console.log(notifications);
        }
        else console.log("no notifications");
    })

    socket.on('deleteNotification', async (notification) => {
        const result = await removeNotification(notification.notificationId);
        io.emit('deleteNotification', "notification deleted")
    })


    socket.on('disconnected', () => {
        console.log("socket.io : User disconnected: ", socket.id);
    })
});


