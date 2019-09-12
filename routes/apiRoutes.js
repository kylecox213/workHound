const db = require("../models");
const passport = require("../config/passport");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // LOGIN POST
  // Query route for user login attempts
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Assuming the user passes the local authentication strategy, send them to the members page
    res.json("/members");
  });


  // USER REGISTRATION POST
  // Query for user registration
  app.post("/api/signup", function (req, res) {
    // If the client request indicates that the user is signing up as a candidate...
    // Test against the string value true because the request body does not pass a boolean
    if (req.body.isCandidate === "true") {
      // Create a new CANDIDATE in the DB
      db.Candidate.create({
        // Funnel in the first and last name info, plus email
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
        // On callback, pass in the new candidate data
      }).then(function (newCand) {
        // Create a new USER using the sequelize create method
        let newUser = db.User.create({
          // Pass in the relevant information, including CandidateId from the candidate just created
          email: req.body.email,
          password: req.body.password,
          isCandidate: req.body.isCandidate,
          isRecruiter: req.body.isRecruiter,
          CandidateId: parseInt(newCand.id)
        });
        return newUser;
      }).then(function () {
        // On callback, take the new USER through the login route to get authenticated and logged in
        res.redirect(307, "/api/login");
        return;
      }).catch(function (err) {
        // If there's an error, send it as JSON
        res.json(err);
      });
    }
    // Otherwise, the client must have signed up as a recruiter...
    else {
      // Create a new RECRUITER in the DB
      db.Recruiter.create({
        // Funnel in the first and last name info, plus email
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
        // On callback, pass in the new recruiter data
      }).then(function (newRec) {
        // Create a new USER using the sequelize create method
        let newUser = db.User.create({
          // Pass in the relevant information, including RecruiterId from the recruiter just created
          email: req.body.email,
          password: req.body.password,
          isCandidate: req.body.isCandidate,
          isRecruiter: req.body.isRecruiter,
          RecruiterId: parseInt(newRec.id)
        });
        return newUser;
      }).then(function () {
        // On callback, take the new USER through the login route to get authenticated and logged in
        res.redirect(307, "/api/login");
        return;
      }).catch(function (err) {
        // If there's an error, send it as JSON
        res.json(err);
      });
    }
  });



  // CANDIDATE REGISTRATION - POST query
  // Route for candidate registration by recruiter
  app.post("/api/registercandidate", function (req, res) {
    db.Candidate.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }).then(newCandidate => {
      // Magic method to add a relationship
      newCandidate.addRecruiter(req.user.RecruiterId)
      // Send the new candidate data back to the client
      res.json(newCandidate);
      console.log("\n\nHere is the data returned to the client after adding the relationship");
      console.log(newCandidate);
      console.log("\n\n");
    });
  });



  // LOGOUT GET
  // Query for the logout function
  app.get("/logout", function (req, res) {
    // Log the user out of the current session and send them back to the index page
    req.logout();
    res.redirect("/");
  });



  // ADD A JOB POST
  // Query for adding jobs to the database
  app.post("/api/addjob", isAuthenticated, function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send back a blank object
      res.json({});
    }
    // Otherwise, a user must be logged into the current session
    else {
      // Create a new row in the Jobs table with the data from the request body as well as the logged in user (recruiter)
      db.Job.create({
        position: req.body.position,
        company: req.body.company,
        CandidateId: parseInt(req.body.CandidateId),
        RecruiterId: parseInt(req.user.RecruiterId)
        // After creating the new job...
      }).then(function (newJob) {
        // Pull candidate associated with the new job, then use the magic add method to establish a relationship
        db.Candidate.findOne({ where: { id: newJob.CandidateId } }).then(candidate => {
          candidate.addRecruiter(newJob.RecruiterId)
          // Then return true to the user
        }).then(function () {
          res.json(true);
        });
      });
    }
  });
};

