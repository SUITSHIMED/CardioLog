import express from "express";
import { addReading, getMyReadings } from "../controllers/readingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getReadingStats } from "../controllers/readingController.js";


const router = express.Router();

router.post("/", protect, addReading);
router.get("/my", protect, getMyReadings);
router.get("/stats", protect, getReadingStats);


export default router;
