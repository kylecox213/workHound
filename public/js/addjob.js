$(document).ready(function () {
    // Getting references to our form and input
    let jobForm = $("form.jobForm");
    let posInput = $("#position");
    let compInput = $("#company");


    // When the recruit button is clicked...
    jobForm.on("submit", function (event) {
        // Prevent the page from reloading
        event.preventDefault();
        // Pull in the form fields' data plus the candidate data attribute from the form element
        let jobData = {
            position: posInput.val().trim(),
            company: compInput.val().trim(),
            CandidateId: jobForm.data("candidate")
        };
        // If the user hasn't specified a position or company...
        if (!jobData.position || !jobData.company) {
            // Don't let them proceed
            return;
        }
        // If we have an email and password, run the signUpUser function
        addJob(jobData);
        // Clear the values from the input fields
        posInput.val("");
        compInput.val("");
    });


    // Function to send the job data to the API
    function addJob(jobData) {
        // Send a POST query to the API URL containing the data related to job form input
        $.post("/api/addjob", {
            position: jobData.position,
            company: jobData.company,
            CandidateId: jobData.CandidateId
            // On callback
        }).then(function (data) {
            // If the callback returns something truthy
            if (data) {
                // Toggle the job modal to indicate success
                $("#jobModal").modal("toggle");
            }
        });
    }
});