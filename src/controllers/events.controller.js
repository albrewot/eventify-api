const path = require("path");
const express = require("express");
const router = express.Router();
const eventService = require("../services/event.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para evento
router.post("/register", isAuth, register);
router.put("/signup/:event", isAuth, signUpForEvent);
router.put("/leave/:event", isAuth, leaveFromEvent);
//invitaciones
router.post("/invitation/create", isAuth, createInvitations);
router.put("/invitation/delete/:id", isAuth, deleteEventInvitation);
router.get("/:id/invitations", isAuth, getEventInvitations);
//info de evento
router.get("/published", isAuth, getEventsPerPage);
router.get("/:id", isAuth, getEventById);
router.get("/user/:id", isAuth, getUserEvents);
router.put("/edit", isAuth, editEvent);
router.put("/image/:id", isAuth, changeEventImage);
router.put("/change_status/:id", isAuth, changeEventPublishStatus);
router.post("/copy", isAuth, copyEventToDraft);
router.delete("/delete/:id", isAuth, deleteEvent);
//pin del mapa
router.post("/pin/create", isAuth, createPin);
router.put("/pin/:id/edit", isAuth, editPin);
router.delete("/pin/:id/delete", isAuth, deletePin);
router.get("/pin/get", isAuth, getAllPins);
router.get("/:event/pin/get_all", isAuth, getEventPin);

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

async function getEventsPerPage(req, res, next) {
  let query = null;
  if (req.query) {
    query = req.query;
  }
  try {
    const events = await eventService.getEventsPerPage(query);
    events
      ? res.json({
          message: "events retrieved successfully",
          data: events.events,
          page: events.page,
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

async function changeEventPublishStatus(req, res, next) {
  try {
    if (!req.body.status) {
      throw {
        type: "validation",
        message: "Status must be supplied"
      };
    }
    const response = await eventService.changeEventPublishStatus(
      req.params.id,
      req.body.status
    );
    res.json({
      message: "Event status edited successfully",
      data: { eventId: response.id, publish_status: response.publish_status }
    });
  } catch (err) {
    next(err);
  }
}

async function copyEventToDraft(req, res, next) {
  try {
    const response = await eventService.copyEventToDraft(req.body.id);
    res.json({
      message: "Event draft copy created successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const response = await eventService.deleteEvent(req.params.id);
    res.json({
      message: "Event deleted successfully",
      data: { eventId: response.id, status: response.status }
    });
  } catch (err) {
    next(err);
  }
}

async function removeEvent(req, res, next) {
  try {
  } catch (err) {
    next(err);
  }
}

async function signUpForEvent(req, res, next) {
  try {
    const response = await eventService.signUpForEvent(
      req.params.event,
      req.body.userId
    );
    console.log(response);
    res.json({
      type: "success",
      message: "User signed up successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function leaveFromEvent(req, res, next) {
  try {
    const response = await eventService.leaveFromEvent(
      req.params.event,
      req.body.userId
    );
    res.json({
      type: "success",
      message: "User was successfully removed from guest list",
      data: response
    });
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
    const response = await eventService.getEventPin(req.params.event);
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
