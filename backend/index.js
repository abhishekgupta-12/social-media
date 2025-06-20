import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// ✅ CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      undefined
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ✅ Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// ✅ Static Files
const staticPath = path.join(__dirname, "/frontend/dist");
app.use(express.static(staticPath));

// ✅ Catch-all for React routes (AFTER static)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(staticPath, "index.html"));
});

// ✅ Start Server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
