require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("src/helpers/jwt");
const errorHandler = require("src/helpers/error-handler");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Usa JWT para darle seguridad a la api
app.use(jwt());

// aplica rutas con el controlador usuario
app.use("/api/users", require("./src/users/users.controller"));

// usa un handler global para imprimir errores de peticion
app.use(errorHandler);

//ruta inicial

app.get("/", (req, res) => {
  res.json({
    message: "infinity has no beginning, no beginning can have no end"
  });
});

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});
