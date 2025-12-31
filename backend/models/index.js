import sequelize from "../config/database.js";
import User from "./user.js";
import Profile from "./profile.js";
import Reading from "./readings.js";

User.hasMany(Reading, { foreignKey: "userId" });
Reading.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Profile, Reading };
