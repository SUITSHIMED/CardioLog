import express from "express";
import { addReading, getMyReadings } from "../controllers/readingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { getReadingStats } from "../controllers/readingController.js";
import { deleteReading } from "../controllers/readingController.js";


const router = express.Router();
/**
 * @swagger
 * /api/readings:
 *   post:
 *     summary: Create a blood pressure reading
 *     tags: [Readings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               systolic:
 *                 type: integer
 *                 example: 120
 *               diastolic:
 *                 type: integer
 *                 example: 80
 *               pulse:
 *                 type: integer
 *                 example: 72
 *     responses:
 *       201:
 *         description: Reading created successfully
 *       401:
 *         description: Unauthorized
 */


router.post("/", protect, addReading);
router.get("/my", protect, getMyReadings);
router.get("/stats", protect, getReadingStats);
router.delete("/:id", protect, deleteReading); 

export default router;
