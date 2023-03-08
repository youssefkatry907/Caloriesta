const socket = io();
socket.on('connection', () => {
    // const userId = "62b5fa62b7d7521898f460a0";
    // socket.emit('connection', userId)
    console.log("connceted");
})
