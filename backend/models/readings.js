import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Reading = sequelize.define("Reading", {
	id: {
		type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
	timestamp: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
});

export default Reading;
