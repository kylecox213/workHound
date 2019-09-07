

module.exports = function (sequelize, DataTypes) {
    let Relationship = sequelize.define("Relationship", {
        RecruiterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CandidateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Relationship;
};
