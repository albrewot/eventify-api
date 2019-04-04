const db = require("../config/db");
const Event = db.Event;

class EventService {
  async create(eventParam) {
    console.log(eventParam);
    if (await Event.findOne({ name: eventParam.name })) {
      throw "Evento ya existe";
    }

    const event = new Event(eventParam);

    await event.save();
  }

  async getEventById(eventId) {
    return await Event.findById(eventId)
      .populate("host")
      .populate("guests");
  }
}

module.exports = new EventService();
