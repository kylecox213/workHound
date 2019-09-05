

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
    
    Candidate.associate = function (models) {
        Candidate.hasMany(models.Job);
    }

    return Candidate;
};