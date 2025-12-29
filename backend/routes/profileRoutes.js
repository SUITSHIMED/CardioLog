import express from "express";
import { getProfileByUserId } from "../controllers/profileController.js";

const router = express.Router();

router.get("/:userId", getProfileByUserId);

export default router;
