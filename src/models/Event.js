const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Address = require("./Embebed/Address");
const Phone = require("./Embebed/Phone");
const Restriction = require("./Embebed/Restrict");

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
    ref: "Reference",
    required: [true, "missing category"]
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reference",
    required: [true, "missing type"]
  },
  modality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reference",
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
  private: {
    type: Boolean,
    default: false
  },
  allowInvitations: {
    type: Boolean,
    default: false
  },
  publish_status: {
    type: String,
    default: "draft"
  },
  status: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  guests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  restrictions: [Restriction],
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

EventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", EventSchema);
