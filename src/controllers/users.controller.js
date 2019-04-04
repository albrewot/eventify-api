const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");

const { isAuth } = require("../middlewares/auth.middleware");

// Rutas para usuario
router.post("/register", register);
router.get("/", isAuth, getAll);
router.get("/current", isAuth, getCurrent);
router.get("/:id", isAuth, getById);
router.put("/:id", isAuth, update);
router.delete("/:id", isAuth, _delete);

module.exports = router;

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json(req.body))
    .catch(err => {
      console.log(err);
      next(err);
    });
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}
