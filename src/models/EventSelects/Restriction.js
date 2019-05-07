const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestrictionSchema = new Schema({
  name: {
    type: String,
    required: [true, "missing restriction name"],
    unique: true
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

RestrictionSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Restriction", RestrictionSchema);
