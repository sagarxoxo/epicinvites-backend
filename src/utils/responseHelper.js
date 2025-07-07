// src/utils/responseHelper.js
const { HTTP_STATUS } = require("../config/constants");

class ResponseHelper {
  static success(res, data, message = "Success", statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Array.isArray(data) && { count: data.length }),
    });
  }

  static error(res, error, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    return res.status(statusCode).json({
      success: false,
      error: typeof error === "string" ? error : error.message,
      ...(process.env.NODE_ENV === "development" && error && error.stack
        ? { stack: error.stack }
        : {}),
    });
  }

  static validationError(res, errors) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: "Validation failed",
      details: Array.isArray(errors) ? errors : [errors],
    });
  }

  static unauthorized(res, message = "Unauthorized access") {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: message,
    });
  }

  static forbidden(res, message = "Forbidden - Admin access required") {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      error: message,
    });
  }

  static notFound(res, message = "Resource not found") {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      error: message,
    });
  }

  static conflict(res, message = "Resource already exists") {
    return res.status(HTTP_STATUS.CONFLICT).json({
      success: false,
      error: message,
    });
  }
}

module.exports = ResponseHelper;
