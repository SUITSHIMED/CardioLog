import { Profile } from "../models/index.js";

export const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const profile = await Profile.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { age, weight, bloodType } = req.body;

    const profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.update({
      age,
      weight,
      bloodType,
    });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
