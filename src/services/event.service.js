const db = require("../config/db");
const validator = require("../validations/events");
const Event = db.Event;
const Invitation = db.Invitation;
const Pin = db.Pin;
const User = db.User;

class EventService {
  async create(params) {
    console.log(params);
    const valid = await validator("register", params);
    if (valid.error) {
      throw { type: "validation", message: valid.error };
    }

    const event = new Event(valid);

    await event.save();
  }

  async getEventById(eventId) {
    return await Event.findById(eventId)
      .populate("host", "-password")
      .populate("guests")
      .populate("category")
      .populate("type")
      .populate("restriction")
      .populate("modality");
  }

  async getUserEvents(host) {
    const hostUser = await User.findById(host);
    if (!hostUser) {
      throw {
        type: "not found",
        message: "Supplied host doesn't exist",
        code: 116
      };
    }
    const events = await Event.find({ host })
      .populate("host", "-password")
      .populate("guests")
      .populate("category")
      .populate("type")
      .populate("restriction")
      .populate("modality");
    console.log(events);
    if (!events || events.length == 0) {
      throw {
        type: "not found",
        message: "Supplied host has no events",
        code: 117
      };
    }
    return events;
  }

  async editEvent(params) {
    const event = await Event.findById(params.id);
    if (!event)
      throw { type: "not found", message: "Event not found", code: 14 };
    console.log(params);

    const valid = await validator("edit", params);
    if (valid.error) {
      throw { type: "validation", message: valid.error };
    }
    console.log(valid);

    Object.assign(event, valid);

    const edited = await event.save();
    return edited;
  }

  async changeAvatar(id, image) {
    const user = await User.findById(id);
    console.log("found", user);
    if (!user) throw { type: "not found", message: "User not found", code: 14 };

    if (image) {
      Object.assign(user, {
        avatar: `${process.env.HOSTNAME_HANDLER}images/avatar/${image}`
      });
      const editedUser = await user.save();
      console.log("edited", editedUser);
      return editedUser;
    } else {
      throw "no image supplied";
    }
  }

  async changeEventImage(id, image) {
    const event = await Event.findById(id);
    console.log("found", event);
    if (!event)
      throw { type: "not found", message: "Event not found", code: 14 };

    if (image) {
      Object.assign(event, {
        image: `${process.env.HOSTNAME_HANDLER}images/events/${image}`
      });
      const editedEvent = await event.save();
      console.log("edited", editedEvent);
      return editedEvent;
    } else {
      throw "no image supplied";
    }
  }

  async createInvitations(params) {
    const valid = await validator("invitation_create", params);
    if (valid.error) {
      throw { type: "validation", message: valid.error };
    }
    const event = await Event.findById(valid.event);
    console.log("found", event);
    if (!event)
      throw { type: "not found", message: "Event not found", code: 14 };
    console.log(valid);
    let notFound = [];
    let invitations = [];
    for (let email of valid.emails) {
      console.log("wdad", email);
      const user = await User.findOne({ email });
      console.log("inv", user);
      if (!user) {
        notFound.push(email);
      } else {
        const invitation = {
          event: valid.event,
          user: user.id
        };
        invitations.push(invitation);
      }
    }
    console.log(notFound, invitations);
    if (invitations.length > 0) {
      const newInvitations = await Invitation.create(invitations);
      if (newInvitations) {
        return { invitations: newInvitations, notfound: notFound };
      } else {
        throw {
          type: "failed",
          message: `Error while creating invitations`,
          code: 204
        };
      }
    } else {
      return { notfound: notFound };
    }
  }

  async getEventInvitations(id) {
    const invitations = await Invitation.find({ event: id })
      .where("active")
      .equals(true);
    if (invitations) {
      return invitations;
    } else {
      throw {
        type: "not found",
        message: "invitations not found"
      };
    }
  }

  async deleteEventInvitation(id) {
    const invitation = await Invitation.findById(id);
    console.log(invitation);
    if (invitation && invitation.active === true) {
      Object.assign(invitation, { active: false });
      const deletedInvitation = await invitation.save();
      return deletedInvitation;
    } else {
      throw {
        type: "not found",
        message: "invitation id provided was not found",
        data: id
      };
    }
  }

  async getAllPins() {
    const pins = await Pin.find({ active: true });
    console.log(pins);
    if (!pins || pins.length < 1) {
      throw { type: "not found", message: "Couldn't find any active pin" };
    }
    return pins;
  }

  async getEventPin(id) {
    const event = await Event.findById(id);
    if (!event) {
      throw {
        type: "not found",
        message: "Couldn't find any event with provided id"
      };
    }
    const pins = await Pin.find({ event: id });
    if (!pins || pins.length < 1) {
      throw { type: "not found", message: "this event has no pins" };
    }
    return pins;
  }

  async createPin(params) {
    const event = await Event.findById(params.event);
    console.log(event);
    if (!event) {
      throw {
        type: "not found",
        message: "Event was not found | cannot create pin"
      };
    }
    const valid = await validator("pin_create", params);
    if (valid.error) {
      throw { type: "validation", message: valid.error };
    }

    Object.assign(valid, { active: event.published });

    const pin = new Pin(valid);

    const newPin = await pin.save();

    return newPin;
  }

  async editPin(id, params) {
    const pin = await Pin.findById(id);
    if (!pin) {
      throw {
        type: "not found",
        message: "Pin was not found | cannot edit pin"
      };
    }
    const valid = await validator("pin_edit", params);
    if (valid.error) {
      throw { type: "validation", message: valid.error };
    }
    Object.assign(pin, valid);

    const editedPin = await pin.save();

    return editedPin;
  }

  async deletePin(id) {
    const pin = await Pin.findById(id);
    if (!pin) {
      throw {
        type: "not found",
        message: "Pin was not found | cannot delete pin"
      };
    }
    const deleted = await Pin.findByIdAndDelete(id);

    if (!deleted) {
      throw { type: "query status", message: "pin was not deleted" };
    }

    return deleted;
  }
}

module.exports = new EventService();
