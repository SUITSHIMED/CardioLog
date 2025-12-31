/* import express from 'express';
import sequelize from './config/database.js';
import { User } from "./models/index.js";

import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT ||3000;

app.use (express.json());

app.get('/', (req , res)=> {
    res.send('cardiolog API is running');
});

app.use("/api/auth", authRoutes);


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("Models synchronized");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
startServer(); */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
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

    await sequelize.sync({ alter: true });
    console.log("Models synchronized");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();
