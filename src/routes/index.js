const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const authController = require("../controllers/auth.controller");
const eventController = require("../controllers/events.controller");
const chatController = require("../controllers/chat.controller");
const countryController = require("../controllers/countries.controller");
const referenceController = require("../controllers/references.controller");

module.exports = app => {
  app.get("/", (req, res) => {
    console.log(req);
    res.send({ message: "Root route" });
  });

  //Rutasd con métodos
  app.use("/api/auth", authController);
  app.use("/api/users", userController);
  app.use("/api/events", eventController);
  app.use("/api/references", referenceController);
  app.use("/api/countries", countryController);
  app.use("/api/chats", chatController);

  //Not found
  app.use(router);
  app.use((req, res) => {
    res
      .status(404)
      .send({ message: `Error 404 - Route [${req.url}] not found`, code: 404 });
  });
};
