const db = require("../models");
const passport = require("../config/passport");

module.exports = function (app) {

  // POST query route for user login attempts
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Assuming the user passes the local authentication strategy, send them to the members page
    res.json("/members");
  });


  // POST query for user registration
  app.post("/api/signup", function (req, res) {
    // If the client request indicates that the user is signing up as a candidate...
    // Test against the string value true because the request body does not pass a boolean
    if (req.body.isCandidate === "true") {
      // Create a new CANDIDATE in the DB
      db.Candidate.create({
        // Funnel in the first and last name info
        firstName: req.body.firstName,
        lastName: req.body.lastName
        // On callback, pass in the new candidate data
      }).then(function (newCand) {
        // Create a new USER using the sequelize create method
        let newUser = db.User.create({
          // Pass in the relevant information, including CandidateId from the candidate just created
          email: req.body.email,
          password: req.body.password,
          isCandidate: req.body.isCandidate,
          isRecruiter: req.body.isRecruiter,
          CandidateId: newCand.id
        });
        return newUser;
      }).then(function () {
        // On callback, take the new USER through the login route to get authenticated and logged in
        res.redirect(307, "/api/login");
      }).catch(function (err) {
        // If there's an error, send it as JSON
        res.json(err);
      });
    }
    // Otherwise, the client must have signed up as a recruiter...
    else {
      // Create a new RECRUITER in the DB
      db.Recruiter.create({
        // Funnel in the first and last name info
        firstName: req.body.firstName,
        lastName: req.body.lastName
        // On callback, pass in the new recruiter data
      }).then(function (newRec) {
        // Create a new USER using the sequelize create method
        let newUser = db.User.create({
          // Pass in the relevant information, including RecruiterId from the recruiter just created
          email: req.body.email,
          password: req.body.password,
          isCandidate: req.body.isCandidate,
          isRecruiter: req.body.isRecruiter,
          RecruiterId: newRec.id
        });
        return newUser;
      }).then(function () {
        // On callback, take the new USER through the login route to get authenticated and logged in
        res.redirect(307, "/api/login");
      }).catch(function (err) {
        // If there's an error, send it as JSON
        res.json(err);
      });
    }
  });


  // GET query for the logout function
  app.get("/logout", function (req, res) {
    // Log the user out of the current session and send them back to the index page
    req.logout();
    res.redirect("/");
  });



  // GET query for user data
  app.get("/api/user_data/self", function (req, res) {
    // If the client request contains no user...
    if (!req.user) {
      // Send back a blank object
      res.json({});
    }
    // Otherwise, a user must be logged into the current session
    else {
      // So respond with the user's email and their User ID
      // Also send the candidate and recruiter IDs
      // Any individual user will only have one of these latter two
      // Which provides an easy way to distinguish between user types
      res.json({
        email: req.user.email,
        id: req.user.id,
        candId: req.user.CandidateId,
        recId: req.user.RecruiterId
      });
    }
  });
};
