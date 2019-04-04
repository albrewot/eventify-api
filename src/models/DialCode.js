const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DialCodeSchema = new Schema({
  country: {
    type: String,
    required: [true, "missing country"]
  },
  dial_code: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

DialCodeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("DialCode", DialCodeSchema);
