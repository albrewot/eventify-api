const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "missing event id"]
  },
  latitude: {
    type: String,
    required: [true, "missing latitude number"]
  },
  longitude: {
    type: String,
    required: [true, "missing longitude number"]
  },
  active: {
    type: Boolean,
    required: [true, "missing pin active"],
    default: false
  }
});

PinSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Pin", PinSchema);
