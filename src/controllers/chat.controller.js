const path = require("path");
const express = require("express");
const router = express.Router();
const chatService = require("../services/chat.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para evento
router.post("/register", isAuth, register);
router.put("/signup/:event", isAuth, signUpForEvent);

module.exports = router;

async function getUserChats(req, res, next) {}
