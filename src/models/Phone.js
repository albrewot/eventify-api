const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
  dial_code: {
    type: String,
    required: [true, "missing dial code"]
  },
  phone_number: {
    type: String,
    required: [true, "missing phone number"]
  }
});

PhoneSchema.set("toJSON", { virtuals: true });

module.exports = PhoneSchema;
