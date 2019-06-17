const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const State = require("./Embebed/State");

const CountrySchema = new Schema({
  code2: String,
  code3: String,
  name: String,
  capital: String,
  subregion: String,
  states: [State],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
});

CountrySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Country", CountrySchema);
