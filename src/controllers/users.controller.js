const path = require("path");
const os = require("os");
const uuidv4 = require("uuid/v4");
const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", register);
router.get("/", isAuth, getAll);
router.get("/:id", isAuth, getById);
router.put("/avatar/:id", isAuth, changeAvatar);
router.put("/edit", isAuth, editUser);
router.put("/change_password/:id", isAuth, changePassword);

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

async function changeAvatar(req, res, next) {
  console.log("files", req.files);
  if (!req.files || !req.files.image) {
    res.json({ message: "no image supplied" });
  }
  const { image } = req.files;
  if (image) {
    console.log("root........", rootDir);
    image.mv(
      path.resolve(rootDir, "public/images/avatar", image.name),
      async error => {
        if (error) {
          next(error);
        }

        try {
          const user = await userService.changeAvatar(
            req.params.id,
            image.name
          );
          console.log(user);
          res.json({
            message: "user avatar edited successfully",
            url: user.avatar,
            code: 103
          });
        } catch (err) {
          next(err);
        }
      }
    );
  }
}

async function changePassword(req, res, next) {
  console.log("password");
  try {
    const response = await userService.changePassword(req.params.id, req.body);
    console.log(response);
    if (response) {
      res.json({ message: "password updated" });
    }
  } catch (err) {
    next(err);
  }
}

function editUser(res, req, next) {
  try {
  } catch (err) {
    next(err);
  }
}
