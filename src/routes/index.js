// src/routes/index.js
const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Epic Invites Backend API is running!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// User routes
router.use("/users", userRoutes);

// Category routes
router.use("/categories", categoryRoutes);

// Future routes can be added here
// router.use('/invitations', invitationRoutes);
// router.use('/events', eventRoutes);
// router.use('/templates', templateRoutes);

module.exports = router;
