

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
            references: {
              model: "Recruiters",
              key: 'id'
            }
          }
    });

    return Job;
};