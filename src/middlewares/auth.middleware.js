let jwt = require("jsonwebtoken");

let isAuth = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    if (bearerToken) {
      console.log("si hay bearer");
      jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
        if (err) {
          console.log(err);
          return res.status(403).send({ message: "Unauthenticated" });
        } else {
          console.log(authData);
          return next();
        }
      });
    }
  } else {
    console.log("no hay bearer");
    res.status(403).send({ message: "Unauthenticated" });
  }
};

module.exports = {
  isAuth
};
