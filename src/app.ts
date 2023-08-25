import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import createError from "http-errors";
import colors from "colors";

const app = express();

const limit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: "To many request at a time, Please try again later",
});

app.use(limit);
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  console.log(colors.blue.bold("First TypeScript server is running"));
  res.status(200).json({
    message: "welcome to the server",
  });
});

app.use((req, res, next) => {
  next(createError(404, "Route Not found"));
});

app.use((req: any, res: any, next: any, err: any) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

export default app;
