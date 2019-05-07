const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModalitySchema = new Schema({
  name: {
    type: String,
    required: [true, "missing Modality name"],
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

ModalitySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Modality", ModalitySchema);
