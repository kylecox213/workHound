$(document).ready(function () {
  // Getting references to our form and input
  let signUpForm = $("form.signup");
  let emailInput = $("input#email-input");
  let passwordInput = $("input#password-input");
  let passwordVerify = $("input#password-verify");
  let firstNameInput = $("input#firstname");
  let lastNameInput = $("input#lastname");

  // Enable tooltips on the page
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });

  // When the signup button is clicked...
  signUpForm.on("submit", function (event) {
    // Prevent the page from reloading
    event.preventDefault();
    // Create a reference to the password 
    let verifiedPass;
    // If the initial password input and the verifcation input match...
    if (passwordInput.val().trim() === passwordVerify.val().trim()) {
      // Set the password equal to the initial input
      verifiedPass = passwordInput.val().trim();
      // Otherwise it will remain falsey and fail the test below
    }
    // If the user doesn't have a proper password by now...
    if (!verifiedPass) {
      // Alert them as much
      alert("Your passwords do not match.")
      // Return from the function to prevent the final signup from going through
      return;
    }
    // Grab the value of whichever radio button is checked under account type
    let acctType = $("input[name='acct-type']:checked").val();
    // Pull in the rest of the form fields' data
    let userData = {
      email: emailInput.val().trim(),
      password: verifiedPass,
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim()
    };
    // If the user selected an account type of Candidate...
    if (acctType === "candidate") {
      // Set boolean values to reflect that
      userData.isCandidate = true;
      userData.isRecruiter = false;
    }
    // If the user selected an account type of Recruiter...
    if (acctType === "recruiter") {
      // Set boolean values to reflect that
      userData.isCandidate = false;
      userData.isRecruiter = true;
    }
    // If the user doesn't have an email, or hasn't chosen an account type...
    if (!userData.email || (!userData.isCandidate && !userData.isRecruiter)) {
      // Don't let them proceed
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData);
    // Clear the values from the input fields
    emailInput.val("");
    passwordInput.val("");
    firstNameInput.val("");
    lastNameInput.val("");
  });


  // Function to send the user registration data to the API
  function signUpUser(userData) {
    // Send a POST query to the API URL containing the data related to user form input
    $.post("/api/signup", {
      email: userData.email,
      password: userData.password,
      isCandidate: userData.isCandidate,
      isRecruiter: userData.isRecruiter,
      firstName: userData.firstName,
      lastName: userData.lastName
      // On callback, append the user data to the window so the user is logged in immediately
    }).then(function (data) {
      window.location.replace(data);
      // If there's an error, handle it
    }).catch(handleLoginErr);
  };

  // Function to handle errors with post-registration login
  function handleLoginErr(err) {
    // Throw up an alert with the error message
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
