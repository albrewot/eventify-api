const express = require("express");
const router = express.Router();
const eventService = require("../services/event.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", isAuth, register);
router.get("/:id", isAuth, getEventById);
router.get("/user/:id", isAuth, getUserEvents);

module.exports = router;

async function register(req, res, next) {
  try {
    const event = await eventService.create(req.body);
    res.json({ message: "event created successfully", data: event, code: 105 });
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await eventService.getEventById(req.params.id);
    event
      ? res.json({
          message: "event retrieved successfully",
          data: event,
          code: 106
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function getUserEvents(req, res, next){
  try{
    const events = await eventService.getUserEvents(req.params.id);
    events ? res.json({
      message: "user's event retrieved successfully",
      data: events,
      code: 115
    })
    : res.sendStatus(404);
  } catch(err){
    next(err);
  }
}
