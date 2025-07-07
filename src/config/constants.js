// src/config/constants.js
module.exports = {
  // User Roles
  USER_ROLES: {
    ADMIN: "admin",
    DESIGNER: "designer",
    SALES: "sales",
    USER: "user",
  },

  // Password Requirements
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },

  // Bcrypt Configuration
  BCRYPT: {
    SALT_ROUNDS: 12,
  },

  // JWT Configuration
  JWT: {
    SECRET:
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production",
    EXPIRES_IN: "24h",
    REFRESH_EXPIRES_IN: "7d",
    ALGORITHM: "HS256",
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Default Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Error Messages
  ERROR_MESSAGES: {
    VALIDATION_FAILED: "Validation failed",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden - Admin access required",
    USER_NOT_FOUND: "User not found",
    EMAIL_EXISTS: "User with this email already exists",
    EMAIL_TAKEN: "Email already taken by another user",
    INVALID_USER_ID: "Invalid user ID",
    INTERNAL_ERROR: "Internal server error",
    INVALID_TOKEN: "Invalid or expired token",
    TOKEN_REQUIRED: "Authorization token required",
    INVALID_CREDENTIALS: "Invalid email or password",
    ACCESS_DENIED: "Access denied for this resource",
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    USER_CREATED: "User created successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
    USERS_RETRIEVED: "Users retrieved successfully",
  },
};
