const db = require("../config/db");
const Event = db.Event;
const User = db.User;

class EventService {
  async create(eventParam) {
    console.log(eventParam);
    if (await Event.findOne({ name: eventParam.name })) {
      throw {
        type: "taken",
        message: "There is already an event with that name",
        code: 206
      };
    }

    const event = new Event(eventParam);

    await event.save();
  }

  async getEventById(eventId) {
    return await Event.findById(eventId)
      .populate("host")
      .populate("guests");
  }

  async getUserEvents(host){
    const hostUser = await User.findById(host);
    if(!hostUser){
      throw {
        type: "not found",
        message: "Supplied host doesn't exist",
        code: 116
      }
    }
    const events = await Event.find({host})
    .populate("host", "-password")
    .populate("guests");
    console.log(events)
    if(!events || events.length == 0){
      throw {
        type: "not found",
        message: "Supplied host has no events",
        code: 117
      }
    }
    return events
  }
}

module.exports = new EventService();
