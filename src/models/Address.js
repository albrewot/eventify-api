const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  description: {
    type: String,
    required: [true, "missing address"]
  }
});

AddressSchema.set("toJSON", { virtuals: true });

module.exports = AddressSchema;
