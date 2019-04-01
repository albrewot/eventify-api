const express = require("express");
const router = express.Router();
const eventService = require("../services/event.service");

// Rutas para usuario
router.post("/register", register);
router.get("/:id", getEventById);

module.exports = router;

function register(req, res, next) {
  eventService
    .create(req.body)
    .then(() => res.json({}))
    .catch(err => {
      console.log(err);
      next(err);
    });
}

function getEventById(req, res, next) {
  eventService
    .getEventById(req.params.id)
    .then(event => (event ? res.json(event) : res.sendStatus(404)))
    .catch(err => next(err));
}
