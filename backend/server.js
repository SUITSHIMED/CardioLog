import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/docs/swagger.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const swaggerDocs = swaggerUi.setup(swaggerSpec);
app.use("/api/docs", swaggerUi.serve, swaggerDocs);
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CardioLog API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/readings", readingRoutes);



const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

   if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log("Models synchronized (development mode)");
    }
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
