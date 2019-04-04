const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

//Middlewares
//MiddleWares
const { isAuth } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.get("/logout", isAuth, logout);

function login(req, res, next) {
  // passport.authenticate("local", { session: false }, (err, user, info) => {
  //   console.log("error: ", err);
  //   console.log(info);
  //   console.log("con", user);
  //   if (info !== undefined) {
  //     next(info);
  //   } else {
  //     req.login(user, err => {
  //       if (err) {
  //         console.log(err);
  //         return res.status(401).json(err);
  //       } else {
  //         return res.status(203).json(user);
  //       }
  //     });
  //   }
  // })(req, res, next);
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign(user, process.env.JWT_SECRET);

      return res.json({ user, token });
    });
  })(req, res, next);
}

// Logout
function logout(req, res) {
  req.logout();
  res.json({ message: "logout" });
}

module.exports = router;
