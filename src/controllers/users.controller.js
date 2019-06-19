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
router.get("/find/user", isAuth, searchUser);
router.get("/invitation/:id", isAuth, getUserInvitations);
router.put("/avatar/:id", isAuth, changeAvatar);
router.put("/edit", isAuth, editUser);
router.put("/change_password", isAuth, changePassword);
router.put("/invitation/:id/confirm", isAuth, confirmUserInvitation);
router.put("/follow/:follow", isAuth, followUser);
router.put("/unfollow/:follow", isAuth, unfollowUser);
router.get("/followers/:id", isAuth, getFollowers);
router.get("/following/:id", isAuth, getFollowing);

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
    const response = await userService.changePassword(req.body);
    console.log(response);
    if (response) {
      res.json({ message: "password updated" });
    }
  } catch (err) {
    next(err);
  }
}

async function editUser(req, res, next) {
  try {
    const response = await userService.editUser(req.body);
    res.json({ message: "user edited successfully", data: response });
  } catch (err) {
    next(err);
  }
}

async function getUserInvitations(req, res, next) {
  try {
    const response = await userService.getUserInvitations(req.params.id);
    res.json({
      type: "success",
      message: "User invitations retrieved successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function confirmUserInvitation(req, res, next) {
  try {
    const response = await userService.confirmUserInvitation(
      req.body,
      req.params.id
    );
    res.json({
      type: "success",
      message: "User invitation confirmed successfully",
      data: response
    });
  } catch (err) {
    next(err);
  }
}

async function followUser(req, res, next) {
  try {
    const response = await userService.followUser(
      req.params.follow,
      req.body.userId
    );
    res.json({ message: "User follow is successfull", data: response });
  } catch (err) {
    next(err);
  }
}

async function unfollowUser(req, res, next) {
  try {
    const response = await userService.unfollowUser(
      req.params.follow,
      req.body.userId
    );
    res.json({ message: "User unfollow is successfull", data: response });
  } catch (err) {
    next(err);
  }
}

async function getFollowers(req, res, next) {
  try {
    const response = await userService.getFollowers(req.params.id);
    res.json({ message: "Users following current user", data: response });
  } catch (err) {
    next(err);
  }
}

async function getFollowing(req, res, next) {
  try {
    const response = await userService.getFollowing(req.params.id);
    res.json({ message: "Users followed by current user", data: response });
  } catch (err) {
    next(err);
  }
}

async function searchUser(req, res, next) {
  try {
    if (!req.query || !req.query.name) {
      throw { type: "invalid qs", message: "must provide name query string" };
    }
    const response = await userService.searchUser(req.query.name);
    res.json({ type: "success", data: response });
  } catch (err) {
    next(err);
  }
}
