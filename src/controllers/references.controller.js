const express = require("express");
const router = express.Router();
const ReferenceService = require("../services/reference.service");

const { isAuth } = require("../middlewares/auth.middleware");

router.post("/create", isAuth, createReference);
router.get("/get", isAuth, getReferences);

async function createReference(req, res, next) {
  try {
    const response = await ReferenceService.createReference(req.body);
    console.log(response);
    res.json({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

async function getReferences(req, res, next) {
  try {
    if (!req.query.type) {
      throw { type: "bad request", message: "must supply a reference type" };
    }
    if (!req.query.type) {
      req.query.parent = null;
    }
    const response = await ReferenceService.getReferences(
      req.query.type,
      req.query.parent
    );
    console.log(response);
    res.json({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
