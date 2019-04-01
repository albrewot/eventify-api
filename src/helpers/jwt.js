const expressJwt = require("express-jwt");
const userService = require("../services/user.service");

module.exports = jwt;

function jwt() {
  const secret = process.env.JWT_SECRET;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // Rutas publicas que no necesitan autenticacion
      "/api/users/login",
      "/api/users/register",
      "/api/events/register",
      "/"
    ]
  });
}

async function isRevoked(req, payload, done) {
  console.log("jue");
  const user = await userService.getById(payload.sub);

  //revoca el token si el usuario ya no existe
  if (!user) {
    return done(null, true);
  }

  done();
}
