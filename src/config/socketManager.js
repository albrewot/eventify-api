module.exports = socket => {
  console.log("user connected on socket " + socket.id);
  socket.on("CHAT_MESSAGE", message => {
    console.log(message);
    socket.broadcast.emit("CHAT_MESSAGE", message);
  });
};
