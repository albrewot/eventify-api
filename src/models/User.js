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
    ref: "Reference",
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    default: null
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    default: null
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
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat"
    }
  ],
  event_signups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }
  ],
  first_login: {
    type: Boolean,
    default: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
