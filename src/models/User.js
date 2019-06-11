const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Phone = require("./Embebed/Phone");
const Address = require("./Embebed/Address");

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "missing username"]
  },
  password: {
    type: String,
    required: [true, "missing password"]
  },
  name: {
    type: String,
    required: [true, "missing name"]
  },
  lastName: {
    type: String,
    default: ""
  },
  birthDate: {
    type: Date,
    default: null
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    default: null
  },
  aboutMe: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    required: [true, "missing email"]
  },
  tlf: [Phone],
  country: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  address: [Address],
  createdAt: {
    type: Date,
    default: Date.now
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }
  ],
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
