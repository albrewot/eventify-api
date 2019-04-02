const express = require("express");
const router = express.Router();
const countryService = require("../services/country.service");

// Rutas para usuario
router.get("/", getAllCountries);
router.get("/dial_codes", getAllDialCodes);
router.get("/:id", getCountryById);
router.post("/create_all", createAllCountries);
router.get("/:id/states", getCountryStates);
router.post("/dial_codes/create_all", registerDialCodes);

module.exports = router;

function createAllCountries(req, res, next) {
  countryService
    .createAllCountries(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getAllCountries(req, res, next) {
  countryService
    .getAllCountries()
    .then(countries => res.json(countries))
    .catch(err => next(err));
}

function getCountryById(req, res, next) {
  countryService
    .getCountryById(req.params.id)
    .then(country => (country ? res.json(country) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getCountryStates(req, res, next) {
  countryService
    .getCountryStates(req.params.id)
    .then(states => (states ? res.json(states) : res.sendStatus(404)))
    .catch(err => next(err));
}

function registerDialCodes(req, res, next) {
  countryService
    .createDialCode(req.body)
    .then(() => res.json({}))
    .catch(err => {
      console.log(err);
      next(err);
    });
}

function getAllDialCodes(req, res, next) {
  countryService
    .getAllDialCodes()
    .then(dialcodes => res.json(dialcodes))
    .catch(err => {
      console.log(err);
      next(err);
    });
}
