const db = require("../config/db");
const Event = db.Event;
const User = db.User;

class EventService {
  async create(eventParam) {
    console.log(eventParam);
    // if (await Event.findOne({ name: eventParam.name })) {
    //   throw {
    //     type: "taken",
    //     message: "There is already an event with that name",
    //     code: 206
    //   };
    // }

    const event = new Event(eventParam);

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

    //Valida si el usuario existe o ya esta usado
    if (!event)
      throw { type: "not found", message: "Event not found", code: 14 };
    console.log(params);
    if (!params.name) {
      params.name = event.name;
    }
    if (!params.type) {
      params.type = event.type;
    }
    if (!params.category) {
      params.category = event.category;
    }
    if (!params.restriction) {
      params.restriction = event.restriction;
    }
    if (!params.modality) {
      params.modality = event.modality;
    }
    if (!params.start_date) {
      params.start_date = event.start_date;
    }
    if (!params.finish_date) {
      params.finish_date = event.finish_date;
    }
    if (!params.description) {
      params.description = event.description;
    }
    if (event.description !== params.description) {
      Object.assign(event, {
        description: params.description
      });
    }
    if (!params.tlf) {
      params.tlf = event.tlf;
    }
    if (!params.address) {
      params.address = event.address;
    }
    if (!params.country) {
      params.country = event.country;
    }
    if (!params.city) {
      params.city = event.city;
    }
    if (!params.state) {
      params.state = event.state;
    }
    Object.assign(event, {
      tlf: params.tlf,
      address: params.address,
      country: params.country,
      city: params.city,
      state: params.state,
      category: params.category,
      type: params.type,
      restriction: params.restriction,
      modality: params.modality,
      start_date: params.start_date,
      finish_date: params.finish_date,
      name: params.name
    });

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
}

module.exports = new EventService();
