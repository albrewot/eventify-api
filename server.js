require("rootpath")();
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const routes = require("./src/routes");
const path = require("path");
const errorHandler = require("./src/middlewares/error.middleware");

//Init
global.rootDir = path.resolve(__dirname);
console.log(rootDir);
const app = express();

// Passport Config
require("./src/config/passport")(passport);

//Middlewares
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

//Routes
routes(app);

//Error Handler Middleware
app.use(errorHandler);

// start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
