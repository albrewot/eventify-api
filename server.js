require("rootpath")();
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("src/helpers/jwt");

const errorHandler = require("src/helpers/error-handler");

const routes = require("./src/routes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Usa JWT para darle seguridad a la api
app.use(jwt());

// aplica rutas con el controlador usuario
routes(app);

// usa un handler global para imprimir errores de peticion
app.use(errorHandler);

app.use(function(req, res, next) {
  return res.status(404).send({ message: "Route" + req.url + " Not found." });
});

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});
