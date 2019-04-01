const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Address = require("./Address");
const Phone = require("./Phone");

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "missing host"]
  },
  guests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  country: {
    type: String
    //required: [true, "missing country"]
  },
  state: {
    type: String
    //required: [true, "missing state"]
  },
  city: {
    type: String
    //required: [true, "missing city"]
  },
  address: [Address],
  tlf: [Phone],
  category: {
    type: String,
    required: [true, "missing category"]
  },
  type: {
    type: String,
    required: [true, "missing type"]
  },
  restriction: {
    type: String,
    required: [true, "missing restriction"]
  },
  start_date: {
    type: Date,
    required: true
  },
  finish_date: {
    type: Date,
    required: true
  },
  createdDate: {
    type: Date,
    efault: Date.now
  }
});

EventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", EventSchema);
