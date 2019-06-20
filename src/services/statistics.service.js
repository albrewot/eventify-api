const db = require("../config/db");
const moment = require("moment");
const mongoose = require("mongoose");
const validator = require("../validations/events");
const { checkRestrictions } = require("../helpers");
const Event = db.Event;
const Invitation = db.Invitation;
const Pin = db.Pin;
const User = db.User;

class StatisticsService {
  async getSingleEventStats(eventId) {
    let stats = {};
    let ageSum = 0;
    let ageAvg = 0;
    const event = await Event.findById(eventId).populate({
      path: "guests",
      select: "genre birthDate",
      populate: { path: "genre" }
    });
    console.log(event);
    let guestNumber = event.guests.length;
    Object.assign(stats, { guest_number: guestNumber });
    let genderCount = [];
    for (let guest of event.guests) {
      let birthday = moment(guest.birthDate);
      let age = moment().diff(birthday, "years");
      ageSum = ageSum + age;
      let entryFound = false;
      let tempObj = {
        name: guest.genre.name,
        count: 1
      };
      for (let genre of genderCount) {
        if (genre.name === tempObj.name) {
          genre.count++;
          entryFound = true;
          break;
        }
      }

      if (!entryFound) {
        genderCount.push(tempObj);
      }
    }
    ageAvg = Math.round(ageSum / guestNumber);
    for (let gender of genderCount) {
      const percentage = (gender.count * 100) / guestNumber;
      Object.assign(gender, { percentage });
    }

    Object.assign(stats, { genderCount, ageAvg });
    return { event, stats };
  }

  async getUserEventsStats(host) {
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "guests",
          foreignField: "_id",
          as: "guests_pop"
        }
      },
      { $match: { host: new mongoose.Types.ObjectId(host) } }
    ]);
    const e = await Event.find({ host });
    console.log(events);
    console.log("find ho", e);
    return events;
  }
}

module.exports = new StatisticsService();