const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "missing sender"]
  },
  body: {
    type: String,
    required: [true, "missing Message Body"]
  },
  createdAt: Date
});

MessageSchema.set("toJSON", { virtuals: true });

module.exports = MessageSchema;
