import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import { connectToDatabase } from "./config/database.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
connectToDatabase();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
