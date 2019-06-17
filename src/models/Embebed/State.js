const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StateSchema = new Schema({
  code: String,
  name: String,
  subdivision: String
});

StateSchema.set("toJSON", { virtuals: true });

module.exports = StateSchema;
