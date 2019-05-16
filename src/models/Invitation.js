const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvitationSchema = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "missing event id"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "missing user id"]
  },
  status: {
    type: String,
    default: "pending"
  },
  used: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
});

InvitationSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Invitation", InvitationSchema);
