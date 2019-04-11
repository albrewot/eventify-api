const express = require("express");
const router = express.Router();
const countryService = require("../services/country.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.get("/", isAuth, getAllCountries);
router.get("/dial_codes", isAuth, getAllDialCodes);
router.get("/:id", isAuth, getCountryById);
router.post("/create", isAuth, createCountries);
router.get("/:id/states", isAuth, getCountryStates);
router.post("/dial_codes/create_all", isAuth, registerDialCodes);

module.exports = router;

async function createCountries(req, res, next) {
  try {
    const countries = await countryService.createCountries(req.body);
    res.json({
      message: "countries saved successfully",
      data: countries,
      code: 107
    });
  } catch (err) {
    next(err);
  }
}

async function getAllCountries(req, res, next) {
  try {
    const countries = await countryService.getAllCountries();
    countries
      ? res.json({
          message: "countries retrieved succesffuly",
          data: countries,
          code: 108
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function getCountryById(req, res, next) {
  try {
    const country = await countryService.getCountryById(req.params.id);
    country
      ? res.json({
          message: "country retrieved successfully",
          data: country,
          code: 108
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function getCountryStates(req, res, next) {
  try {
    const states = await countryService.getCountryStates(req.params.id);
    states
      ? res.json({
          message: "states retrieved successfilly",
          data: states,
          code: 109
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function registerDialCodes(req, res, next) {
  try {
    const dialcodes = await countryService.createDialCode(req.body);
    res.json({
      message: "dial code(s) registered successfully",
      data: dialcodess,
      code: 110
    });
  } catch (err) {
    next(err);
  }
}

async function getAllDialCodes(req, res, next) {
  try {
    const dialcodes = await countryService.getAllDialCodes();
    dialcodes
      ? res.json({
          message: "dial codes retrieved successfully",
          data: dialcodes,
          code: 111
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}
