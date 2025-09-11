const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./routes/userRoutes");
const taskRoute = require("./routes/taskRoutes");

const allowedOrigins = [
  "http://localhost:3000",
  "https://taskmanager-frontend-wn3t.onrender.com",
];
const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/", userRoute);
app.use("/tasks", taskRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port: " + port);
});

app.get("/ping", (req, res) => res.send("pong"));
