import express from "express";
import { register, login } from "../controllers/authController.js";
import { getCurrentUser, updateUserProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Get current user with profile data
router.get("/me", protect, getCurrentUser);

// Update user profile
router.put("/me", protect, updateUserProfile);

export default router;
