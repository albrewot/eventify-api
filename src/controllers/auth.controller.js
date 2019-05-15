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
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      return res.status(400).json({
        type: "failed",
        message: info ? info.message : "Login failed",
        user: user,
        code: info.message === "Missing credentials" ? 6 : info.code
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        next(err);
      }

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      return res.json({ type: "success", user, token, code: 101 });
    });
  })(req, res, next);
}

// Logout
function logout(req, res) {
  req.logout();
  res.json({ message: "logout", code: 102 });
}

module.exports = router;
