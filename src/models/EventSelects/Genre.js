const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: {
    type: String,
    required: [true, "missing Genre name"],
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

GenreSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Genre", GenreSchema);
