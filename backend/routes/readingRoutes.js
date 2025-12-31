import express from "express";
import { addReading, getMyReadings } from "../controllers/readingController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, addReading);
router.get("/my", protect, getMyReadings);

export default router;
