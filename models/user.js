const bcrypt = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define("User", {
        // Only store email (as username)
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        // Password
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // And user type in the User model
        // Default user types to false, reset to true based on account creation settings
        isRecruiter: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isCandidate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // Other data to be stored in associated user account type tables
    });

    // Associate the user to its proper account model
    User.associate = function (models) {
        // Create an association between Users and Recruiters
        User.belongsTo(models.Recruiter, {
            foreignkey: {
                allowNull: true
            }
        });
        // Create an association between Users and Candidates
        User.belongsTo(models.Candidate, {
            foreignkey: {
                allowNull: true
            }
        });
        // Use the 1:1 belongsTo association so the foreignkey is stored inside the User
        // Create an association to both Recruiter and Candidate models, and at the time of
        // account registration, create the type of account actually associated with this User login.
        // Because Users cannot edit their User accounts, this will functionally pair them with
        // only one or the other. The upshot is that we are able to populate the Users table
        // with both RecruiterIds and CandidateIds, allowing us to bridge the User login
        // (which is integral to the authentication schema) to the individual account information
        // which necessarily changes based on the type of user that is logged in
    };

    // Give each user a function to validate passwords
    // Takes in the hashed password (created by the hook below)
    // Compares it to the hashed password stored in the DB using bcryptjs
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };


    // Hook to hash passwords before creating user account
    // Means that plain text passwords are never stored - higher security
    User.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    });

    return User;

};