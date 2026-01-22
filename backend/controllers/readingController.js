import { Reading } from "../models/index.js";
import { Sequelize } from "sequelize";

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
export const getReadingStats = async (req, res) => {
  try {
    const stats = await Reading.findOne({
      where: { userId: req.user.id },
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("systolic")), "avgSystolic"],
        [Sequelize.fn("AVG", Sequelize.col("diastolic")), "avgDiastolic"],
        [Sequelize.fn("AVG", Sequelize.col("pulse")), "avgPulse"],
      ],
      raw: true,
    });

    const latest = await Reading.findOne({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({ stats, latest });
  } catch (e) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};
export const deleteReading = async (req, res) => {
  try {
    const { id } = req.params;

    const reading = await Reading.findOne({
      where: {
        id,
        userId: req.user.id, // 🔒 important: user can delete ONLY their own reading
      },
    });

    if (!reading) {
      return res.status(404).json({
        message: "Reading not found",
      });
    }

    await reading.destroy();

    res.status(200).json({
      message: "Reading deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Delete reading error:", error);
    res.status(500).json({
      message: "Failed to delete reading",
    });
  }
};
