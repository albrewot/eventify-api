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
  Reference: require("../models/References")
};
