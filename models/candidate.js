

module.exports = function (sequelize, DataTypes) {
    let Candidate = sequelize.define("Candidate", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Candidate;
};