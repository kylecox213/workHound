const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // PROMO PAGE - GET query
  // Get request for the promo page
  app.get("/promo", function (req, res) {
    res.render("promo");
  });


  // LOGIN PAGE - GET query
  // Get request for the application URL without any specific URL params
  app.get("/", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Don't do anything
      return;
    }
    // Otherwise, send them to the index (login) page
    res.render("index");
  });


  // LOGIN PAGE - GET query
  // Get request for the login page specifically
  app.get("/login", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Don't do anything
      return;
    }
    // Otherwise, send them to the index (login) page
    res.render("index");
  });


  // HOME PAGE - GET query
  // Get request for the user's homepage
  app.get("/home", function (req, res) {
    console.log(req.user);
    // If the user is a candidate...
    if (req.user.isCandidate) {
      // Send them to the proper homepage
      res.render("candHome");
    }
    // Otherwise, they must be a recruiter, so...
    else {
      // Send them to their homepage
      res.render("recHome");
    };
  })


  // USER REGISTRATION - GET query
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


  // LANDING PAGE - GET query 
  // Get request for the first page a user sees once logged in
  app.get("/members", isAuthenticated, function (req, res) {
    // If the user is a candidate...
    if (req.user.isCandidate) {
      // Send them to the proper landing page, pass in the membername
      res.render("candLand", {
        membername: req.user.email
      });
    }
    // Otherwise, they must be a recruiter, so...
    else {
      // Send them to the other landing page
      res.render("recLand", {
        membername: req.user.email
      });
    };
  });


  // VIEW ALL - GET query
  // Get request for the view all candidates page
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


  // VIEW ONE USER - GET query
  // Get request for an individual candidate page
  app.get("/user/:id", isAuthenticated, function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send them to the login page
      res.render("index");
    }
    // Otherwise, they must be logged in, so...
    else {
      // Create an array to hold the promises
      let promises = [];
      // Create a promise to return the candidate
      let candPromise =
        // Query the DB for the candidate
        db.Candidate.findOne({
          // with the same ID as the one on the current page
          where: {
            id: req.params.id
          }
        });
      // Push the candPromise into the array
      promises.push(candPromise);
      // Create a promise to return the candidate's jobs
      let jobsPromise =
        // Query the database for all jobs
        db.Job.findAll({
          // associated with the candidate whose ID is the same as the current page
          where: {
            CandidateId: req.params.id
          }
        });
      // Push the jobsPromise into the array
      promises.push(jobsPromise);
      // Then, when all all the promises have returned, send the total data to the client
      Promise.all(promises).then(function (data) {
        // The first index of the data will be the user
        // The second index will be an array of all the jobs
        // And render the viewOne page with that candidate's data
        res.render("viewOne", {
          candidate: data[0],
          jobs: data[1]
        });
      });
    }
  });


  // ADD JOB FOR USER - GET query
  // Get route for the add job form page
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