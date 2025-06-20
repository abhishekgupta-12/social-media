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

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// ✅ Correct CORS middleware for same-domain deployment
const corsOptions = {
  origin: true, // Allow same-origin (Render serves frontend + backend together)
  credentials: true
};

// ✅ Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// ✅ Serve frontend static files from Vite build
const frontendPath = path.join(__dirname, "/frontend/dist");
app.use(express.static(frontendPath));

// ✅ React fallback (for routes like /profile/:id)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Start the server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
