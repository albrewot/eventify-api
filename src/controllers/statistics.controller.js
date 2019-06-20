const path = require("path");
const express = require("express");
const moment = require("moment");
const router = express.Router();
const statisticsService = require("../services/statistics.service");

const { isAuth } = require("../middlewares/auth.middleware");

router.get("/event/:id", isAuth, getSingleEventStats);

module.exports = router;

async function getSingleEventStats(req, res, next) {
  console.log(req.params.id);
  try {
    const response = await statisticsService.getSingleEventStats(req.params.id);
    res.json({ type: "success", data: response });
  } catch (err) {
    next(err);
  }
}
