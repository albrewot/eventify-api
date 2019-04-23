const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", register);
router.get("/", isAuth, getAll);
router.get("/:id", isAuth, getById);

module.exports = router;

async function register(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.json({ message: "user created successfully", code: 103 });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const users = await userService.getAll();
    users
      ? res.json({
          message: "users retrieved successfully",
          data: users,
          code: 104
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getById(req.params.id);
    user
      ? res.json({
          message: "user retrieved successfully",
          data: user,
          code: 104
        })
      : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}