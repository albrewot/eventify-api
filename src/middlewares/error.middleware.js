const errorHandler = (err, req, res, next) => {
  if (typeof err === "string") {
    //Cualquier error que se pase por parametro
    console.log(err);
    return res.status(400).json({ message: err });
  }

  if (err.message) {
    console.log(err);
    return res.status(400).json(err.message);
  }

  if (err.name === "ValidationError") {
    // Error de validacion de Mongoose
    console.log(err);
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "Unauthorized") {
    // Error de autenticacion
    console.log(err);
    return res.status(401).json({ message: "Unauthenticated" });
  }

  // Error de servidor 500 por default
  console.log(err);
  return res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
