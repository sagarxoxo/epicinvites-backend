// src/middleware/errorHandler.js
const ResponseHelper = require("../utils/responseHelper");

class ErrorHandler {
  static handle(err, req, res, next) {
    // Log error only in development
    if (process.env.NODE_ENV === "development") {
      console.error(err.stack);
    }
    // Handle specific error types
    if (err.name === "ValidationError") {
      return ResponseHelper.validationError(res, err.message);
    }
    if (err.name === "UnauthorizedError") {
      return ResponseHelper.unauthorized(res, err.message);
    }
    if (err.name === "ForbiddenError") {
      return ResponseHelper.forbidden(res, err.message);
    }
    if (err.name === "NotFoundError") {
      return ResponseHelper.notFound(res, err.message);
    }
    if (err.name === "ConflictError") {
      return ResponseHelper.conflict(res, err.message);
    }
    // Default error response
    return ResponseHelper.error(res, err.message || "Something went wrong!");
  }

  static notFound(req, res, next) {
    return ResponseHelper.notFound(res, "Route not found");
  }
}

module.exports = ErrorHandler;
