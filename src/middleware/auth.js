// src/middleware/auth.js
const ResponseHelper = require("../utils/responseHelper");
const JwtHelper = require("../utils/jwtHelper");
const UserService = require("../services/userService");
const { ERROR_MESSAGES, USER_ROLES } = require("../config/constants");

class AuthMiddleware {
  /**
   * Middleware to require admin access using JWT token
   * Supports both JWT tokens and legacy admin-token for backward compatibility
   */
  static async requireAdmin(req, res, next) {
    try {
      // Check for legacy admin-token first (for backward compatibility)
      const adminToken = req.headers["admin-token"];
      if (
        adminToken &&
        (adminToken === process.env.ADMIN_SECRET_TOKEN ||
          adminToken === "admin-secret-token")
      ) {
        req.admin = {
          id: 1,
          role: USER_ROLES.ADMIN,
          email: "admin@epicinvites.com",
          fullName: "System Administrator",
        };
        return next();
      }

      // Check for JWT token in Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return ResponseHelper.unauthorized(res, ERROR_MESSAGES.TOKEN_REQUIRED);
      }

      const token = JwtHelper.extractToken(authHeader);
      if (!token) {
        return ResponseHelper.unauthorized(
          res,
          "Invalid authorization format. Use 'Bearer <token>'"
        );
      }

      // Validate token format
      if (!JwtHelper.isValidTokenFormat(token)) {
        return ResponseHelper.unauthorized(res, "Invalid token format");
      }

      // Verify JWT token
      const decoded = JwtHelper.verifyToken(token);

      // Check if user is admin
      if (!JwtHelper.isAdmin(decoded)) {
        return ResponseHelper.forbidden(res, ERROR_MESSAGES.FORBIDDEN);
      }

      // Verify user still exists in database and is still admin (security best practice)
      try {
        const user = await UserService.getUserById(decoded.id);
        if (user.role !== USER_ROLES.ADMIN) {
          return ResponseHelper.forbidden(res, "Admin privileges revoked");
        }
        req.admin = user;
      } catch (error) {
        return ResponseHelper.unauthorized(res, "User not found or invalid");
      }

      next();
    } catch (error) {
      // Handle specific JWT errors
      if (error.message.includes("expired")) {
        return ResponseHelper.unauthorized(
          res,
          "Token has expired. Please login again."
        );
      }
      if (
        error.message.includes("invalid") ||
        error.message.includes("Invalid")
      ) {
        return ResponseHelper.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
      }
      if (error.message.includes("malformed")) {
        return ResponseHelper.unauthorized(res, "Malformed token");
      }
      return ResponseHelper.unauthorized(res, error.message);
    }
  }

  /**
   * Middleware to require authentication (any authenticated user)
   */
  static async requireAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return ResponseHelper.unauthorized(res, ERROR_MESSAGES.TOKEN_REQUIRED);
      }

      const token = JwtHelper.extractToken(authHeader);
      if (!token) {
        return ResponseHelper.unauthorized(
          res,
          "Invalid authorization format. Use 'Bearer <token>'"
        );
      }

      // Validate token format
      if (!JwtHelper.isValidTokenFormat(token)) {
        return ResponseHelper.unauthorized(res, "Invalid token format");
      }

      // Verify JWT token
      const decoded = JwtHelper.verifyToken(token);

      // Verify user still exists in database
      try {
        const user = await UserService.getUserById(decoded.id);
        req.user = user;
      } catch (error) {
        return ResponseHelper.unauthorized(res, "User not found or invalid");
      }

      next();
    } catch (error) {
      // Handle specific JWT errors
      if (error.message.includes("expired")) {
        return ResponseHelper.unauthorized(
          res,
          "Token has expired. Please login again."
        );
      }
      if (
        error.message.includes("invalid") ||
        error.message.includes("Invalid")
      ) {
        return ResponseHelper.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
      }
      if (error.message.includes("malformed")) {
        return ResponseHelper.unauthorized(res, "Malformed token");
      }
      return ResponseHelper.unauthorized(res, error.message);
    }
  }

  /**
   * Middleware to require specific role(s)
   */
  static requireRole(roles) {
    return async (req, res, next) => {
      try {
        // First ensure user is authenticated
        await AuthMiddleware.requireAuth(req, res, () => {});

        if (!req.user) {
          return ResponseHelper.unauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
        }

        // Check if user has required role
        if (!JwtHelper.hasRole(req.user, roles)) {
          const roleList = Array.isArray(roles) ? roles.join(", ") : roles;
          return ResponseHelper.forbidden(
            res,
            `Access denied. Required roles: ${roleList}`
          );
        }

        next();
      } catch (error) {
        return ResponseHelper.unauthorized(res, error.message);
      }
    };
  }

  /**
   * Middleware to require admin or user owns the resource
   */
  static requireAdminOrOwner(userIdParam = "id") {
    return async (req, res, next) => {
      try {
        // First authenticate the user
        const authHeader = req.headers.authorization;
        const adminToken = req.headers["admin-token"];

        // Check for admin access first
        if (
          adminToken &&
          (adminToken === process.env.ADMIN_SECRET_TOKEN ||
            adminToken === "admin-secret-token")
        ) {
          req.admin = {
            id: 1,
            role: USER_ROLES.ADMIN,
            email: "admin@epicinvites.com",
          };
          return next();
        }

        // Check for JWT admin
        if (authHeader) {
          const token = JwtHelper.extractToken(authHeader);
          if (token) {
            const decoded = JwtHelper.verifyToken(token);

            if (JwtHelper.isAdmin(decoded)) {
              req.admin = decoded;
              return next();
            }

            // Check if user owns the resource
            const resourceUserId = parseInt(req.params[userIdParam]);
            if (decoded.id === resourceUserId) {
              const user = await UserService.getUserById(decoded.id);
              req.user = user;
              return next();
            }
          }
        }

        return ResponseHelper.forbidden(
          res,
          "Access denied. Admin access or resource ownership required"
        );
      } catch (error) {
        return ResponseHelper.unauthorized(res, error.message);
      }
    };
  }

  /**
   * Optional authentication - doesn't fail if no token provided
   */
  static optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    try {
      const token = JwtHelper.extractToken(authHeader);
      if (token) {
        const decoded = JwtHelper.verifyToken(token);
        req.user = decoded;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  }
}

module.exports = AuthMiddleware;
