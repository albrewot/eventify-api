const path = require("path");
const express = require("express");
const router = express.Router();
const chatService = require("../services/chat.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para evento
router.get("/user/:id", isAuth, getUserChats);

module.exports = router;

async function getUserChats(req, res, next) {
  try {
    const response = await chatService.getUserChats(req.params.id);
    res.json({ message: "user chats found", data: response });
  } catch (err) {
    next(err);
  }
}
