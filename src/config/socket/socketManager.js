const chatService = require("../../services/chat.service");

module.exports = socket => {
  console.log("user connected on socket " + socket.id);
  socket.on("CHAT_MESSAGE", message => {
    console.log(message);
    socket.broadcast.emit("CHAT_MESSAGE", message);
  });

  socket.on("CREATE_CHAT", async members => {
    console.log(members);
    const chat = await chatService.createChat(members);
    console.log("res", chat);
    if (!chat) {
      socket.emit(`ERROR-${members[0]}`, {
        type: "failed chat",
        message: "Error while creating chat"
      });
    }
    for (let member of members) {
      console.log(member);
      const other = chat.members.filter(members => members.id != member);
      const parsedChat = chat.toObject();
      Object.assign(parsedChat, { other });
      console.log("chatt", parsedChat);
      socket.emit(`NEW-CHAT-${member}`, parsedChat);
    }
  });

  socket.on("JOIN_CHAT", chatId => {
    console.log("Join", chatId);
    console.log(`ROOM-${chatId.toString()}`);
    socket.join(`ROOM-${chatId.toString()}`);
  });

  socket.on("ROOM_MESSAGE", async info => {
    console.log(info);
    console.log(`ROOM-${info.room.toString()}`);
    socket
      .in(`ROOM-${info.room.toString()}`)
      .emit(`ROOM_MESSAGE-${info.room.toString()}`, info.newMessage);
  });
};
