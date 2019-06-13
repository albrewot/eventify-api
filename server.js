require("rootpath")();
require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const routes = require("./src/routes");
const path = require("path");
const errorHandler = require("./src/middlewares/error.middleware");
const socketManager = require("./src/config/socket/socketManager");

io.on("connection", socket => socketManager(socket, io));

//Init
global.rootDir = path.resolve(__dirname);
console.log(rootDir);

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
server.listen(port, () => {
  console.log("Server listening on port " + port);
});
