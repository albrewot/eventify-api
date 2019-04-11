const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Phone = require("../models/Phone");
const Address = require("../models/Address");

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
    type: String
  },
  email: {
    type: String,
    required: [true, "missing email"]
  },
  tlf: [Phone],
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  address: [Address],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
