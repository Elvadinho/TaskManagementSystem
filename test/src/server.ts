import express, { type Request, type Response } from "express";
import authroutes from "./routes/auth.routes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authroutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript!!!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
