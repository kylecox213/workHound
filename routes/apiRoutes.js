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


  // USER REGISTRATION CHECK
  // Query to see if an email is already registered to a user account
  app.post("/api/registercheck", function (req, res) {
    // Query the database for a user with the email the user is attempting to register
    db.User.findOne({
      where: { email: req.body.email }
    })
      .then(function (existingUser) {
        // If there is an existing user with that email...
        if (existingUser) {
          // Send an object with a boolean set to true as JSON to the client
          res.json({ emailRegistered: true });
          throw new Error("That email is already registered to a User account.");
        }
        else {
          // Send an object with a boolean set to false as JSON to the client
          res.json({ emailRegistered: false });
        };
      });
  });


  // USER REGISTRATION POST
  // Query for user registration
  app.post("/api/signup", function (req, res) {
    // If the client request indicates that the user is signing up as a candidate...
    // Test against the string value true because the request body does not pass a boolean
    if (req.body.isCandidate === "true") {
      // If the recruiter provided a UID key...
      if (req.body.key) {
        // Test to see if there is already a candidate account registered by a recruiter for this individual
        // By checking for one with that UID key AND the email provided
        db.Candidate.findOne({
          where: { id: req.body.key, email: req.body.email }
        }).then(function (existingCand) {
          // If an existing candidate is found...
          if (existingCand) {
            // Then there's no need to create a candidate account, so just skip to creating the user account
            // Create a new USER using the sequelize create method
            db.User.create({
              // Pass in the relevant information, including CandidateId from the candidate just created
              email: req.body.email,
              password: req.body.password,
              isCandidate: req.body.isCandidate,
              isRecruiter: req.body.isRecruiter,
              CandidateId: parseInt(existingCand.id)
            }).then(function (newUser) {
              // Return the newly created USER
              return newUser;
            }).then(function () {
              // On callback, take the new USER through the login route to get authenticated and logged in
              res.redirect(307, "/api/login");
              return;
            });
          }
          // If no existing candidate was found...
          else {
            // Return a piece of data to the client indicating that no match was found for the UID
            // This will prompt the client-side logic to show the appropriate error message
            res.json({ keyMatch: false });
            return;
          }
        }).catch(function (err) {
          // If there's an error, send it as JSON
          res.json(err);
        });
      }
      // Otherwise, still check to see if a candidate already exists with that email...
      else {
        db.Candidate.findOne({
          where: { email: req.body.email }
        }).then(function (existingCand) {
          // If there is an existing candidate with that email address...
          if (existingCand) {
            // Return a piece of data to the client indicating that a match was found for their email
            // This will prompt the client-side logic to show the appropriate error message
            res.json({ emailMatch: true });
            return;
          }
          // Otherwise, the user is free to go ahead with registration
          else {
            // Create a new CANDIDATE in the DB
            db.Candidate.create({
              // Funnel in the first and last name info, plus email
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email
              // On callback, pass in the new candidate data
            }).then(function (newCand) {
              // Create a new USER using the sequelize create method
              db.User.create({
                // Pass in the relevant information, including CandidateId from the candidate just created
                email: req.body.email,
                password: req.body.password,
                isCandidate: req.body.isCandidate,
                isRecruiter: req.body.isRecruiter,
                CandidateId: parseInt(newCand.id)
              }).then(function (newUser) {
                // Return the newly created USER
                return newUser;
              }).then(function () {
                // On callback, take the new USER through the login route to get authenticated and logged in
                res.redirect(307, "/api/login");
                return;
              });
            }).catch(function (err) {
              // If there's an error, send it as JSON
              res.json(err);
            });
          }
        });
      }
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
      newCandidate.addRecruiter(req.user.RecruiterId);
      // Send the new candidate data back to the client
      res.json(newCandidate);
    });
  });



  // LOGOUT GET
  // Query for the logout function
  app.get("/logout", function (req, res) {
    // Log the user out of the current session and send them back to the landing index page
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
        db.Candidate.findOne({
          where: { id: newJob.CandidateId }
        }).then(candidate => {
          candidate.addRecruiter(newJob.RecruiterId)
          // Then return true to the user
        }).then(function () {
          res.json(true);
        });
      });
    }
  });
};

