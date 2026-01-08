import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jobApplicationRoutes from "./routes/jobApplication.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { APP_ORIGIN, PORT } from "./constants/env";

const app = express();

app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.use(express.json());

app.use(cookieParser());

app.use("/api/job-applications", jobApplicationRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
