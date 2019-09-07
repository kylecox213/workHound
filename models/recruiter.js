

module.exports = function (sequelize, DataTypes) {
    let Recruiter = sequelize.define("Recruiter", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Recruiter.associate = function (models) {
        Recruiter.belongsToMany(models.Candidate, { through: 'Relationships' });
    }

    return Recruiter;
};
