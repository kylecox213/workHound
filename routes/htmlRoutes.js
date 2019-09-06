const path = require("path");
const db = require("../models");
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

  // Get request for the login page specifically
  app.get("/index", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Redirect them to the user homepage
      res.render("navbar", {
        membername: req.user.email
      });
    }
    // Otherwise, send them to the index page
    res.render("index");
  });

  // Get request for the user registration page
  app.get("/users/register", function (req, res) {
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

  // GET request for the view all candidates page
  app.get("/users/viewall", isAuthenticated, function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send them to the login page
      res.render("index");
    }
    // Otherwise, they must be logged in, so...
    else {
      // Query the DB for all the candidates
      db.Candidate.findAll({})
        // Then send the data back to the client
        .then(function (data) {
          // And render the viewAll page with the candidate data
          res.render("viewAll", {
            candidates: data
          });
        });
    }
  });


  // GET request for an individual candidate page
  app.get("/user/:id", isAuthenticated, function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send them to the login page
      res.render("index");
    }
    // Otherwise, they must be logged in, so...
    else {
      // Query the DB for the candidate
      db.Candidate.findOne({
        // with an ID equal to what was passed into the URL parameter
        where: {
          id: req.params.id
        }
      })
        // Then send the data back to the client
        .then(function (data) {
          // And render the viewOne page with that candidate's data
          res.render("viewOne", {
            user: data
          });
        });
    }
  });


  // GET route for the add job form page
  app.get("/user/:id/addjob", isAuthenticated, function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send them to the login page
      res.render("index");
    }
    // Otherwise, they must be logged in, so...
    else {
      db.Candidate.findOne({
        where: {
          id: req.params.id
        }
      }).then(function (data) {
        res.render("addJob", {
          cand: data
        });
      });
    }
  });
}