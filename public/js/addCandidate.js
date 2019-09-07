$(document).ready(function () {

    // Getting references to our form and input
    let registerForm = $("form#register");
    let emailInput = $("input#email");
    let firstNameInput = $("input#firstname");
    let lastNameInput = $("input#lastname");
    let positionInput = $("input#position");
    let companyInput = $("input#company");


    // When the signup button is clicked...
    registerForm.on("submit", function (event) {
        // Prevent the page from reloading
        event.preventDefault();

        let userData = {
            email: emailInput.val().trim(),
            firstName: firstNameInput.val().trim(),
            lastName: lastNameInput.val().trim()
        };
        // Register the new candidate from the recruiter input
        registerCandidate(userData)
        // Clear the values from the input fields
        emailInput.val("");
        firstNameInput.val("");
        lastNameInput.val("");
    });


    // Function to send the user registration data to the API
    function registerCandidate(userData) {
        // Send a POST query to the API URL containing the data related to registration input
        $.post("/api/registercandidate", userData).then(function (data) {
            if (data) {
                let jobData = {
                    position: positionInput.val().trim(),
                    company: companyInput.val().trim(),
                    CandidateId: data.CandidateId
                }
                $.post("/api/addjob", jobData)
                    .then(function (data) {
                        if (data) {
                            // Toggle the reg modal to indicate success
                            $("#reg-modal").modal("toggle");
                        }
                    });
            }
        });
    };
});
