import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
// cors for cross origin resourse sharing for share backend to frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use(cookieParser());

// user router export
import userRouter from "./routes/user.routes.js";
import bodyParser from "body-parser";
app.use("/api/V1/users", userRouter);
export { app };
