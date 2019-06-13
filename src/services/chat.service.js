const db = require("../config/db");
const moment = require("moment");
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
}

module.exports = new chatService();
