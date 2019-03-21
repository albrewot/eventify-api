const expressJwt = require("express-jwt");
const config = require("config.json");
const userService = require("../users/user.service");

module.exports = jwt;

function jwt() {
  const secret = config.secret;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      // Rutas publicas que no necesitan autenticacion
      "/api/users/login",
      "/api/users/register"
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  //revoca el token si el usuario ya no existe
  if (!user) {
    return done(null, true);
  }

  done();
}
