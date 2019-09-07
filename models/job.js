

module.exports = function (sequelize, DataTypes) {
    let Job = sequelize.define("Job", {
        company: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        RecruiterId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        CandidateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Job;
};