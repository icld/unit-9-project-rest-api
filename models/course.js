"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = sequelize => {
  class Course extends Model {}
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A title is required"
          },
          notEmpty: {
            msg: "Please provide a title"
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A description is required"
          },
          notEmpty: {
            msg: "Please provide a description"
          }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "An estimated time is required"
          },
          notEmpty: {
            msg: "Please provide an estimated time"
          }
        }
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Materials Needed is required"
          },
          notEmpty: {
            msg: "Please provide Materials Needed"
          }
        }
      },
      userId: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A password is required"
          },
          notEmpty: {
            msg: "Please provide a password"
          },
          len: {
            args: [8, 20],
            msg: "The password should be between 8 and 20 characters in length"
          }
        }
      }
    },
    { sequelize }
  );

  Course.associate = models => {
    Course.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };
  return Course;
};
