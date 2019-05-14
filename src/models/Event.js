const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Address = require("./Address");
const Phone = require("./Phone");
const Pin = require("./Pin");

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
    //required: true
  },
  image: {
    type: String,
    default: ""
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
    type: String,
    default: null
    //required: [true, "missing country"]
  },
  state: {
    type: String,
    default: null
    //required: [true, "missing state"]
  },
  city: {
    type: String,
    default: null
    //required: [true, "missing city"]
  },
  address: [Address],
  tlf: [Phone],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "missing category"]
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Type",
    required: [true, "missing type"]
  },
  restriction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restriction",
    required: [true, "missing restriction"]
  },
  modality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Modality",
    required: [true, "missing modality"]
  },
  start_date: {
    type: Date,
    required: true
  },
  finish_date: {
    type: Date,
    required: true
  },
  pins: [Pin],
  createdAt: {
    type: Date,
    efault: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

EventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", EventSchema);
