
// --------------------------------------------------------------------------
// Dependencies
// --------------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");

const db = require("./models");

// --------------------------------------------------------------------------
// App definitions
// --------------------------------------------------------------------------

// Global vars
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Set up to handle URL and JSON parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Set up static file directory
app.use(express.static("public"));

// Set up session to keep track of user login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Set the app engine to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// --------------------------------------------------------------------------
// Sync models and initialize server
// --------------------------------------------------------------------------


db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

module.exports = app;
