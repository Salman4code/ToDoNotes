import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes";

dotenv.config();
const app = express();

// FIXED CORS (Express v5 Compatible)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  console.log("Incoming request →", req.method, req.url);

  next();
});

app.use(express.json());

// MongoDB connect
mongoose
  .connect("mongodb://127.0.0.1:27017/keep-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));
console.log('notesRouter:', notesRouter);
app.use("/api/notes", notesRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
