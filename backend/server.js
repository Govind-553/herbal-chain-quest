import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import collectorRoutes from "./routes/collectorRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import processorRoutes from "./routes/processorRoutes.js";
import consumerRoutes from "./routes/consumerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AyurChain Backend is running!");
});

app.use("/collector", collectorRoutes);
app.use("/labtest", labRoutes);
app.use("/processor", processorRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/consumer", consumerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});