const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true
});

mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/User"),
  Event: require("../models/Event"),
  DialCode: require("../models/DialCode"),
  Country: require("../models/Country"),
  Invitation: require("../models/Invitation"),
  Pin: require("../models/Pin"),
  References: {
    Category: require("../models/EventSelects/Category"),
    Type: require("../models/EventSelects/Type"),
    Modality: require("../models/EventSelects/Modality"),
    Genre: require("../models/EventSelects/Genre"),
    Reference: require("../models/EventSelects/Reference")
  },
  Chat: require("../models/Chat/Chat")
};
