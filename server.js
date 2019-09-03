
// --------------------------------------------------------------------------
// Dependencies
// --------------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");

const db = require("./models");

// --------------------------------------------------------------------------
// App definitions
// --------------------------------------------------------------------------

// Global vars
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Set up to handle URL and JSON parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Set up static file directory
app.use(express.static("public"));

// Set the app engine to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// --------------------------------------------------------------------------
// Sync models and initialize server
// --------------------------------------------------------------------------


// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});

module.exports = app;
