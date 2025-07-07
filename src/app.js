// src/app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const routes = require("./routes");
const ErrorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve raw Swagger JSON for Postman import
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Epic Invites Backend API",
    documentation: "/api-docs",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      docs: "/api-docs",
    },
  });
});

// API routes
app.use("/api", routes);

// Simple test endpoint (no auth required)
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Test endpoint is working!" });
});

// Legacy routes (keeping for backwards compatibility)
app.get("/users", async (req, res) => {
  res.status(301).json({
    success: false,
    message: "This endpoint has been moved to /api/users",
    newEndpoint: "/api/users",
  });
});

// Error handling middleware
app.use(ErrorHandler.handle);

// 404 handler
app.use("*", ErrorHandler.notFound);

module.exports = app;
