import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },

  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  height: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});


User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

export default Profile;
