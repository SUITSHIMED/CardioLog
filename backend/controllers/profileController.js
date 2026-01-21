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

export const getCurrentUser = async (req, res) => {
  try {
    const profile = await Profile.findOne({ 
      where: { userId: req.user.id } 
    });

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: profile?.name || "",
      age: profile?.age || null,
      weight: profile?.weight || null,
      height: profile?.height || null,
      bloodType: profile?.bloodType || "",
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { age, weight, height, name, bloodType } = req.body;
    const userId = req.user.id;

    let profile = await Profile.findOne({ where: { userId } });

    if (!profile) {
      profile = await Profile.create({
        userId,
        name: name || "",
        age: age ? parseInt(age, 10) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bloodType: bloodType || "",
      });
    } else {
      if (name !== undefined) profile.name = name;
      if (age !== undefined) profile.age = age ? parseInt(age, 10) : null;
      if (weight !== undefined) profile.weight = weight ? parseFloat(weight) : null;
      if (height !== undefined) profile.height = height ? parseFloat(height) : null;
      if (bloodType !== undefined) profile.bloodType = bloodType;
      await profile.save();
    }

    res.json({
      id: userId,
      email: req.user.email,
      name: profile.name,
      age: profile.age,
      weight: profile.weight,
      height: profile.height,
      bloodType: profile.bloodType,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Error updating profile", details: error.message });
  }
};
