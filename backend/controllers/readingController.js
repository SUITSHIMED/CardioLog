import { Reading } from "../models/index.js";

export const addReading = async (req, res) => {
	try {
		const { systolic, diastolic, pulse } = req.body;

		if (!systolic || !diastolic || !pulse) {
			return res.status(400).json({ message: "All fields required" });
		}

		const reading = await Reading.create({
			systolic,
			diastolic,
			pulse,
			userId: req.user.id,
		});

		res.status(201).json(reading);
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: "Failed to create reading" });
	}
};

export const getMyReadings = async (req, res) => {
	try {
		const readings = await Reading.findAll({
			where: { userId: req.user.id },
			order: [["createdAt", "DESC"]],
		});
		res.json(readings);
	} catch (e) {
		res.status(500).json({ message: "Failed to fetch readings" });
	}
};
