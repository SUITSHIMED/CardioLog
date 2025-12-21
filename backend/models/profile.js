import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Profile = sequelize.define("Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
});

//association User exists --> Profile belongs to User
//one user = one profile (1–1 relation)
User.hasOne(Profile, { foreignKey: "userId", onDelete: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId" });

export default Profile;
