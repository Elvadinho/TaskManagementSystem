import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
const PORT = Number(process.env.PORT) || 5000;
async function start() {
    try {
        await prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
start();
export default app;
//# sourceMappingURL=app.js.map