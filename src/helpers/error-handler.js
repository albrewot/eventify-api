module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    //Cualquier error que se pase por parametro
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // Error de validacion de Mongoose
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // Error de autenticacion de JWT
    return res.status(401).json({ message: "Invalid Token" });
  }

  // Error de servidor 500 por default
  return res.status(500).json({ message: err.message });
}
