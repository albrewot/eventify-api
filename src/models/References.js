const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReferenceSchema = new Schema({
  name: {
    type: String,
    required: [true, "missing reference name"],
    unique: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reference",
    default: null
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

ReferenceSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Reference", ReferenceSchema);
