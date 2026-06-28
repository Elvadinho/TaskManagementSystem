import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Invalid JSON payload" });
    }
    next();
  });
});

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
    status: "ok",
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
