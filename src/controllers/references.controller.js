const express = require("express");
const router = express.Router();
const ReferenceService = require("../services/reference.service");

const { isAuth } = require("../middlewares/auth.middleware");

router.get("/", isAuth, getReferences);
router.get("/type", isAuth, getType);
router.get("/category", isAuth, getCategory);
router.get("/restriction", isAuth, getRestriction);
router.get("/modality", isAuth, getModality);
router.get("/genre", isAuth, getGenre);

router.post("/type/create", isAuth, createType);
router.post("/category/create", isAuth, createCategory);
router.post("/restriction/create", isAuth, createRestriction);
router.post("/modality/create", isAuth, createModality);
router.post("/genre/create", isAuth, createGenre);
//router.get("/category/:id", isAuth, getReferenceByParent);
//router.post("/register_all", isAuth, registerReferences);

async function getReferences(req, res, next) {
  try {
    const references = await ReferenceService.getReferences();
    console.log("get references 1", references);
    return res.json({
      message: "references retrieved successfully",
      data: references,
      code: 112
    });
  } catch (err) {
    console.log("get references 2");
    next(err);
  }
}

async function getReferenceByParent(req, res, next) {
  try {
    const references = await ReferenceService.getReferencesByParent(req.params);
    res.json({ message: "references found", data: references, code: 113 });
  } catch (err) {
    next(err);
  }
}

async function getParents(req, res, next) {
  try {
    const references = await ReferenceService.getParents();
    res.json({ message: "references found", data: references, code: 113 });
  } catch (err) {
    next(err);
  }
}

async function registerReferences(req, res, next) {
  try {
    const references = await ReferenceService.create(req.body);
    console.log("saved", references);
    res.status(200).json({
      message: "References stored successfully",
      data: references,
      code: 114
    });
  } catch (err) {
    next(err);
  }
}

async function createType(req, res, next) {
  try {
    const response = await ReferenceService.createType(req.body);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function createCategory(req, res, next) {
  try {
    const response = await ReferenceService.createCategory(req.body);
    console.log(response);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function createRestriction(req, res, next) {
  try {
    const response = await ReferenceService.createRestriction(req.body);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

async function createModality(req, res, next) {
  try {
    const response = await ReferenceService.createModality(req.body);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

async function createGenre(req, res, next) {
  try {
    const response = await ReferenceService.createGenre(req.body);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

async function getType(req, res, next) {
  try {
    const response = await ReferenceService.getType();
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function getCategory(req, res, next) {
  try {
    const response = await ReferenceService.getCategory();
    console.log(response);
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function getRestriction(req, res, next) {
  try {
    const response = await ReferenceService.getRestriction();
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function getModality(req, res, next) {
  try {
    const response = await ReferenceService.getModality();
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}
async function getGenre(req, res, next) {
  try {
    const response = await ReferenceService.getGenre();
    res.send({ message: "success", data: response });
  } catch (err) {
    next(err);
  }
}

module.exports = router;
