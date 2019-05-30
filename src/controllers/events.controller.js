const path = require("path");
const express = require("express");
const router = express.Router();
const eventService = require("../services/event.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", isAuth, register);
//invitaciones
router.post("/invitation/create", isAuth, createInvitations);
router.put("/invitation/delete/:id", isAuth, deleteEventInvitation);
router.get("/:id/invitations", isAuth, getEventInvitations);
//info de evento
router.get("/:id", isAuth, getEventById);
router.get("/user/:id", isAuth, getUserEvents);
router.put("/edit", isAuth, editEvent);
router.put("/image/:id", isAuth, changeEventImage);
//pin del mapa
router.post("/pin/create", isAuth, createPin);
router.put("/pin/:id/edit", isAuth, editPin);
router.delete("/pin/:id/delete", isAuth, deletePin);
router.get("/pin/get", isAuth, getAllPins);
router.get("/pin/:id/get", isAuth, getEventPin);

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

async function getEventInvitations(req, res, next) {
  try {
    const response = await eventService.getEventInvitations(req.params.id);
    res.json({
      type: "success",
      message: "Invitations retrieved successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEventInvitation(req, res, next) {
  try {
    const response = await eventService.deleteEventInvitation(req.params.id);
    res.json({
      type: "success",
      message: "Invitation deleted successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function getAllPins(req, res, next) {
  try {
    const response = await eventService.getAllPins();
    1;
    res.json({
      type: "success",
      message: "Pins retrieved successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function getEventPin(req, res, next) {
  try {
    const response = await eventService.getEventPin(req.params.id);
    res.json({
      type: "success",
      message: "Pins retrieved successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function createPin(req, res, next) {
  try {
    const response = await eventService.createPin(req.body);
    res.json({
      type: "success",
      message: "Pin created successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function editPin(req, res, next) {
  try {
    const response = await eventService.editPin(req.params.id, req.body);
    res.json({
      type: "success",
      message: "Pin edited successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function deletePin(req, res, next) {
  try {
    const response = await eventService.deletePin(req.params.id);
    res.json({
      type: "success",
      message: "Pin deleted successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}
