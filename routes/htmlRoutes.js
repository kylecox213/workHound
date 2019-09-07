const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {


  // LOGIN PAGE - GET query
  // Get request for the application URL without any specific URL params
  app.get("/", function (req, res) {
    // If the user is already logged in...
    if (req.user) {
      // Don't do anything
      res.redirect("/members");
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
      // Don't do anything
      return;
    }
    // Otherwise, they must be a recruiter, so...
    else {
      db.Recruiter.findOne({ where: { id: req.user.RecruiterId } }).then(recruiter => {
        let promises = [];
        let recPromise = db.Recruiter.findOne({
          where: {
            id: req.user.RecruiterId
          }
        });
        promises.push(recPromise);
        let candsPromise = recruiter.getCandidates();
        promises.push(candsPromise);
        Promise.all(promises).then(function (data) {
          console.log(JSON.stringify(data));
          // The recruiter will be data[0]
          // All subsequent indices will be candidates in association with that recruiter
          // Send them to the other landing page
          res.render("recHome", {
            user: data[0],
            candidates: data[1]
          });
        });
      });
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


  // CANDIDATE REGISTRATION BY RECRUITER - GET query
  app.get("/users/registercandidate", function (req, res) {
    if (!req.user) {
      res.render("index");
    }
    else if (req.user.isCandidate) {
      res.render("404");
    }
    else {
      res.render("addCandidate");
    }

  });


  // LANDING PAGE - GET query 
  // Get request for the first page a user sees once logged in
  app.get("/members", isAuthenticated, function (req, res) {
    // If the user is a candidate...
    if (req.user.isCandidate) {
      // Create an array to hold the promises
      let promises = [];
      // Create a promise to return the candidate
      let candPromise =
        // Query the DB for the candidate
        db.Candidate.findOne({
          // with the same ID as the one on the current page
          where: {
            id: req.user.CandidateId
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
            CandidateId: req.user.CandidateId
          }
        });
      // Push the jobsPromise into the array
      promises.push(jobsPromise);
      // Then, when all all the promises have returned, send the total data to the client
      Promise.all(promises).then(function (data) {
        console.log(JSON.stringify(data));
        // The first index of the data will be the user
        // The second index will be an array of all the jobs
        // And render the viewOne page with that candidate's data
        res.render("candHome", {
          candidate: data[0],
          jobs: data[1]
        });
      })
    }
    // Otherwise, they must be a recruiter, so...
    else {
      db.Recruiter.findOne({ where: { id: req.user.RecruiterId } }).then(recruiter => {
        let promises = [];
        let recPromise = db.Recruiter.findOne({
          where: {
            id: req.user.RecruiterId
          }
        });
        promises.push(recPromise);
        let candsPromise = recruiter.getCandidates();
        promises.push(candsPromise);
        Promise.all(promises).then(function (data) {
          console.log(JSON.stringify(data));
          // The recruiter will be data[0]
          // All subsequent indices will be candidates in association with that recruiter
          // Send them to the other landing page
          res.render("recLand", {
            user: data[0],
            candidates: data[1]
          });
        });
      });
    }
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


  // CATCHALL GET query
  // For any URL request not explicitly mentioned above
  app.get("*", function (req, res) {
    res.render("404");
  })
}