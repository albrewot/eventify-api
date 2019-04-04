const express = require("express");
const router = express.Router();
const ReferenceService = require("../services/reference.service");

const { isAuth } = require("../middlewares/auth.middleware");

router.get("/", isAuth, getReferences);
router.get("/category/:id", isAuth, getReferenceByParent);
router.post("/register_all", isAuth, registerReferences);

async function getReferences(req, res, next) {
  try {
    const references = await ReferenceService.getReferences();
    console.log("get references 1", references);
    return res.json(references);
  } catch (err) {
    console.log("get references 2");
    next(err);
  }
}

async function getReferenceByParent(req, res, next) {
  try {
    const references = await ReferenceService.getReferencesByParent(req.params);
    res.status(200).send({ message: "references found", data: references });
  } catch (err) {
    next(err);
  }
}

async function registerReferences(req, res, next) {
  try {
    const references = await ReferenceService.create(req.body);
    console.log("saved", references);
    res
      .status(200)
      .json({ message: "References stored successfully", data: references });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
