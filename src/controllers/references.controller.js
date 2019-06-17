const express = require("express");
const router = express.Router();
const ReferenceService = require("../services/reference.service");

const { isAuth } = require("../middlewares/auth.middleware");

router.get("/type", isAuth, getType);
router.get("/category", isAuth, getCategory);
router.get("/modality", isAuth, getModality);
router.get("/genre", isAuth, getGenre);

router.post("/create", isAuth, createReference);
router.get("/get", isAuth, getReferences);

router.post("/type/create", isAuth, createType);
router.post("/category/create", isAuth, createCategory);
router.post("/modality/create", isAuth, createModality);
router.post("/genre/create", isAuth, createGenre);

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
