const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "missing Category name"],
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

CategorySchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Category", CategorySchema);
