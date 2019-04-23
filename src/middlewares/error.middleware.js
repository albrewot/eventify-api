const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    // Error de validacion de Mongoose
    console.log(err);
    return res.status(400).json({ message: err.message, code: 3 });
  } else if (err.name === "CastError") {
    return res.status(400).json({ message: err.message, code: 7 });
  } else if (err.message) {
    return res.status(400).json(err);
  } else if (typeof err === "string") {
    return res.status(400).json({ message: err });
  }

  // Error de servidor 500 por default
  console.log(err);
  return res.status(500).json({ message: err.message, code: 4 });
};

module.exports = errorHandler;
