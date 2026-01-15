import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { Profile, User } from "../models/index.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Get current user with profile data
router.get("/me", protect, async (req, res) => {
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
});

// Update user profile
router.put("/me", protect, async (req, res) => {
  try {
    const { age, weight, height, name, bloodType } = req.body;
    const userId = req.user.id;

    console.log("=== PROFILE UPDATE REQUEST ===");
    console.log("User ID:", userId);
    console.log("Request Body:", { age, weight, height, name, bloodType });

    let profile = await Profile.findOne({ where: { userId } });
    console.log("Existing Profile:", profile ? "Found" : "Not found");

    if (!profile) {
      // Create new profile
      console.log("Creating new profile...");
      profile = await Profile.create({
        userId,
        name: name || "",
        age: age ? parseInt(age, 10) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bloodType: bloodType || "",
      });
      console.log("Profile created successfully");
    } else {
      // Update existing profile
      console.log("Updating existing profile...");
      if (name !== undefined) profile.name = name;
      if (age !== undefined) profile.age = age ? parseInt(age, 10) : null;
      if (weight !== undefined) profile.weight = weight ? parseFloat(weight) : null;
      if (height !== undefined) profile.height = height ? parseFloat(height) : null;
      if (bloodType !== undefined) profile.bloodType = bloodType;
      await profile.save();
      console.log("Profile updated successfully");
    }

    console.log("Final Profile Data:", profile.dataValues);
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
    console.error("=== PROFILE UPDATE ERROR ===");
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    res.status(500).json({ message: "Error updating profile", details: error.message });
  }
});

export default router;
