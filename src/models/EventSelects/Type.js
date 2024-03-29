const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  name: {
    type: String,
    required: [true, "missing Type name"],
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

TypeSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Type", TypeSchema);
