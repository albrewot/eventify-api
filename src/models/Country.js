const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const State = require("../models/State");

const CountrySchema = new Schema({
  code2: String,
  code3: String,
  name: String,
  capital: String,
  subregion: String,
  states: [State]
});

CountrySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Country", CountrySchema);
