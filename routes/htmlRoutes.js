const path = require("path");

const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // Get request for the promo page
  app.get("/promo", function (req, res) {
    res.render("promo");
  });

  // Get request for the application URL without any specific URL params
  app.get("/", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Redirect them to the user homepage
      res.redirect("/members");
    }
    // Otherwise, send them to the index page
    res.render("index");
  });

  // Get request for the login page specifically
  app.get("/login", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Redirect them to the user homepage
      res.redirect("/members");
    }
    // Otherwise, send them to the index page
    res.render("index");
  });

  // Get request for the user registration page
  app.get("/users/register", function(req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Redirect them to the user homepage
      res.redirect("/members");
    }
    // Otherwise, send them to the registration page
    res.render("register");
  });

  // Get request for the 'members' page once a user is logged in
  app.get("/members", isAuthenticated, function (req, res) {
    // Send them to the navbar page, pass in the membername
    res.render("navbar", {
      membername: req.user.email
    });
  });
}
