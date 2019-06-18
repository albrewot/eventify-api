const db = require("../config/db");
const moment = require("moment");
const mongoose = require("mongoose");
const validator = require("../validations/events");
const { checkRestrictions } = require("../helpers");
const Event = db.Event;
const Invitation = db.Invitation;
const User = db.User;
const Chat = db.Chat;

class chatService {
  async createChat(members) {
    console.log("service", members);
    try {
      let notFound = [];
      if (!members || members.length != 2) {
        throw { message: "missing members to create chat", data: members };
      }
      for (let member of members) {
        const user = await User.findById(member);
        if (!user) {
          notFound.push(member);
        }
      }
      if (notFound.length != 0) {
        throw {
          message: "one or more members from the chat were not found",
          data: notFound
        };
      }
      let chat = await Chat.create({ members });
      chat = await chat
        .populate("members", "id name lastName avatar")
        .execPopulate();
      return chat;
    } catch (err) {
      console.log(err);
    }
  }

  async saveMessages(chatId, messages) {
    try {
      if (!chatId) {
        throw { type: "missing", message: "missing chat id" };
      }
      if (!messages || messages.length == 0) {
        throw { type: "missing", message: "missing messages" };
      }
      let chat = await Chat.findById(chatId);
      if (!chat) {
        throw { type: "not found", message: "chat was not found" };
      }
      Object.assign(chat, { messages: [...chat.messages, messages] });
      return await chat.save();
    } catch (err) {
      throw err;
    }
  }

  async getChatById(chatId) {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat || chat.length === 0) {
        throw { type: "not found", message: "Chat was not found" };
      }
      return chat;
    } catch (err) {
      throw err;
    }
  }

  async getUserChats(userId) {
    try {
      if (!userId) {
        throw { type: "missing", message: "missing userId" };
      }
      const user = await User.findById(userId);
      if (!user) {
        throw { type: "not found", message: "user was not found" };
      }
      console.log("user", userId);
      const userChats = await Chat.find({
        members: {
          $in: [user.id]
        }
      }).populate("members", "id name lastName avatar");
      console.log("user Chats", userChats);
      let parsedUserChats = [];
      for (let userChat of userChats) {
        console.log("in user", userChat);
        const other = userChat.members.filter(members => members.id != user.id);
        console.log("other", other);
        const parsedChat = userChat.toObject();
        Object.assign(parsedChat, { other });
        parsedUserChats = [...parsedUserChats, parsedChat];
      }
      console.log(parsedUserChats);
      return parsedUserChats;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new chatService();
