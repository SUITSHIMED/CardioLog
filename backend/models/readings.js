import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Reading = sequelize.define("Reading", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	systolic: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	diastolic: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	pulse: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default Reading;
