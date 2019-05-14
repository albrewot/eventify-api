const path = require("path");
const express = require("express");
const router = express.Router();
const eventService = require("../services/event.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", isAuth, register);
router.post("/invitation/create", isAuth, createInvitations);
router.get("/:id", isAuth, getEventById);
router.get("/user/:id", isAuth, getUserEvents);
router.put("/edit", isAuth, editEvent);
router.put("/image/:id", isAuth, changeEventImage);

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

async function getUserEvents(req, res, next) {
  try {
    const events = await eventService.getUserEvents(req.params.id);
    events
      ? res.json({
          message: "user's event retrieved successfully",
          data: events,
          code: 115
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function changeEventImage(req, res, next) {
  console.log("files", req.files);
  if (!req.files || !req.files.image) {
    res.json({ message: "no image supplied" });
  }
  const { image } = req.files;
  if (image) {
    console.log("root........", rootDir);
    image.mv(
      path.resolve(rootDir, "public/images/events", image.name),
      async error => {
        if (error) {
          next(error);
        }
        try {
          const event = await eventService.changeEventImage(
            req.params.id,
            image.name
          );
          console.log(event);
          res.json({
            message: "event image edited successfully",
            url: event.image,
            code: 103
          });
        } catch (err) {
          next(err);
        }
      }
    );
  }
}

async function editEvent(req, res, next) {
  try {
    const response = await eventService.editEvent(req.body);
    res.json({ message: "Event edited successfully", data: response });
  } catch (err) {
    next(err);
  }
}

async function createInvitations(req, res, next) {
  try {
    const response = await eventService.createInvitations(req.body);
    res.json({ message: response });
  } catch (err) {
    next(err);
  }
}
