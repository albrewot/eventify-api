const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./Message");

const ChatSchema = new Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  messages: [Message]
});

ChatSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Chat", ChatSchema);
