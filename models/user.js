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

    // Give each user a function to validate passwords
    // Takes in the hashed password (created by the hook below)
    // Compares it to the hashed password stored in the DB using bcryptjs
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    // Associate the user to its proper account model
    User.associate = function (models) {
        // If the User is a recruiter, associate it with the Recruiter model
        if (this.isRecruiter) {
            User.belongsTo(models.Recruiter, {
                foreignkey: {
                    allowNull: true
                }
            })
    
        };
        // If the User is a candidate, associate it with the Candidate model
        if (this.isCandidate) {
            User.belongsTo(models.Candidate, {
                foreignkey: {
                    allowNull: true
                }
            })
            };
    //     // User the 1:1 belongsTo association so the foreignkey is stored inside the User
    //     // Thinking we should chain our post commands, so based on user input
    //     // Either create the candidate/recruiter, then in the callback put a post command
    //     // to create the User, that way an associated foreignkey can always be added here

    }

    // Hook to hash passwords before creating user account
    // Means that plain text passwords are never stored - higher security
    User.addHook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
    });

    return User;

};