const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestrictSchema = new Schema({
  restrictionType: {
    type: Schema.Types.Mixed,
    required: true
  },
  rules: [],
  restrictTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre"
    }
  ]
});

RestrictSchema.set("toJSON", { virtuals: true });

module.exports = RestrictSchema;
