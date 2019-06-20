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
    return { stats };
  }

  async getUserEventsStats(host) {
    let stats = {};
    let guestSum = 0;
    let ageSum = 0;
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "guests",
          foreignField: "_id",
          as: "guests"
        }
      },
      { $match: { host: new mongoose.Types.ObjectId(host) } }
    ]);
    console.log(events);
    for (let event of events) {
      let eventAgeSum = 0;
      const eventGuest = event.guests.length;
      guestSum = guestSum + eventGuest;
      for (let guest of event.guests) {
        let birthday = moment(guest.birthDate);
        let age = moment().diff(birthday, "years");
        eventAgeSum = eventAgeSum + age;
      }
      ageSum = ageSum + eventAgeSum;
    }
    const eventNum = events.length;
    const avgGuest = Math.round(guestSum / eventNum);
    const avgAge = Math.round(ageSum / guestSum);
    Object.assign(stats, { eventNum, avgGuest, avgAge });
    return { stats };
  }

  async getAdminEventsStats() {
    let stats = {};
    let guestSum = 0;
    let ageSum = 0;
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "guests",
          foreignField: "_id",
          as: "guests"
        }
      }
    ]);
    console.log(events);
    for (let event of events) {
      let eventAgeSum = 0;
      const eventGuest = event.guests.length;
      guestSum = guestSum + eventGuest;
      for (let guest of event.guests) {
        let birthday = moment(guest.birthDate);
        let age = moment().diff(birthday, "years");
        eventAgeSum = eventAgeSum + age;
      }
      ageSum = ageSum + eventAgeSum;
    }
    const eventNum = events.length;
    const avgGuest = Math.round(guestSum / eventNum);
    const avgAge = Math.round(ageSum / guestSum);
    Object.assign(stats, { eventNum, avgGuest, avgAge });
    return { stats };
  }
}

module.exports = new StatisticsService();
