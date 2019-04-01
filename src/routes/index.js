const express = require("express");
const router = express.Router();
const userController = require("../controllers/users.controller");
const eventController = require("../controllers/events.controller");
const countryController = require("../controllers/countries.controller");

module.exports = app => {
  app.get("/", (req, res) => {
    res.send({ message: "Root route" });
  });

  //Rutasd con métodos
  app.use("/api/users", userController);
  app.use("/api/events", eventController);
  app.use("/api/countries", countryController);

  //Not found
  app.use(router);
  app.use((req, res) => {
    res.send({ message: "Route not found" });
  });
};
