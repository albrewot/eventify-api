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
  firstName: {
    type: String,
    required: [true, "missing first name"]
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
    type: String,
    required: [true, "missing country"]
  },
  state: {
    type: String,
    required: [true, "missing state"]
  },
  city: {
    type: String,
    required: [true, "missing city"]
  },
  address: [Address],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
