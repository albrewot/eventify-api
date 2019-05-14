const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  title: {
    type: String,
    required: [true, "missing title number"]
  },
  image: {
    type: String,
    required: [true, "missing image number"]
  },
  latitude: {
    type: String,
    required: [true, "missing latitude number"]
  },
  longitude: {
    type: String,
    required: [true, "missing longitude number"]
  }
});

PinSchema.set("toJSON", { virtuals: true });

module.exports = PinSchema;
