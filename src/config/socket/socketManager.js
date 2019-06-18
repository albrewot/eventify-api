const chatService = require("../../services/chat.service");

module.exports = (socket, io) => {
  console.log("user connected on socket " + socket.id);
  socket.room = socket.id;
  socket.on("CHAT_MESSAGE", message => {
    console.log(message);
    socket.emit("CHAT_MESSAGE", message);
  });

  socket.on("CREATE_CHAT", async (members, callback) => {
    console.log("holis");
    const checkChats = await chatService.getUserChats(members[0]);
    console.log("check", checkChats);
    let foundChat = null;
    for (let checkChat of checkChats) {
      console.log(checkChat.other[0].id, members[1]);
      if (checkChat.other[0].id == members[1]) {
        foundChat = checkChat;
        break;
      }
    }
    console.log("FOUND", foundChat);
    if (foundChat) {
      callback(foundChat);
      return;
    } else {
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
    }
  });

  socket.on("RETRIEVE_CHATS", async userId => {
    console.log("RETRIEVE_CHAT", userId);
    const chats = await chatService.getUserChats(userId);
    console.log("CHAT", chats);
    socket.emit("UPDATE_CHATS", chats);
  });

  socket.on("RETRIEVE_MESSAGES", async chatId => {
    console.log("RETRIEVE_", chatId);
    const chat = await chatService.getChatById(chatId);
    console.log("CHAT MESSAGE", chat);
    socket.emit("UPDATE_MESSAGES", chat);
  });

  socket.on("JOIN_CHAT", async chatId => {
    socket.leave(socket.room);
    socket.join(chatId);
    console.log("Join", chatId);
    socket.room = chatId;
    socket.to(chatId).emit(`ROOM_MESSAGE-${chatId}`, "connecto");
    console.log(`ROOM-${chatId}`);
  });

  socket.on("ROOM_MESSAGE", async info => {
    console.log(info);
    console.log(info.room);
    console.log(socket.rooms);
    io.sockets.in(info.room).emit(`ROOM_MESSAGE-${info.room}`, info.newMessage);
    const updatedChat = await chatService.saveMessages(
      info.room,
      info.newMessage
    );
    console.log(updatedChat);
  });
};
