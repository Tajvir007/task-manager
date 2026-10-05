require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "DevOps Task Manager API",
    version: "1.0.0",
    docs: "/api/tasks"
  });
});

// Liveness probe: the process is running.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Application is running"
  });
});

// Readiness probe: kept simple for Phase 1.
// Later we will make this verify the database connection too.
app.get("/ready", (req, res) => {
  res.status(200).json({
    status: "ready",
    message: "Application is ready"
  });
});

app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      details: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid task ID." });
  }

  res.status(500).json({
    message: "Internal server error."
  });
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
