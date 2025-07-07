// src/controllers/authController.js
const UserService = require("../services/userService");
const ResponseHelper = require("../utils/responseHelper");
const ValidationHelper = require("../utils/validationHelper");
const JwtHelper = require("../utils/jwtHelper");
const {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  HTTP_STATUS,
} = require("../config/constants");

class AuthController {
  /**
   * User login endpoint
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const validation = ValidationHelper.validateLoginInput({
        email,
        password,
      });
      if (!validation.isValid) {
        return ResponseHelper.validationError(res, validation.errors);
      }
      const result = await UserService.authenticate(email, password);
      return ResponseHelper.success(
        res,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: result.tokens.expiresIn,
        },
        "Login successful",
        HTTP_STATUS.OK
      );
    } catch (error) {
      if (error.message === ERROR_MESSAGES.INVALID_CREDENTIALS) {
        return ResponseHelper.unauthorized(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  /**
   * Refresh access token endpoint
   */
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return ResponseHelper.validationError(res, "Refresh token is required");
      }
      const result = await UserService.refreshToken(refreshToken);
      return ResponseHelper.success(
        res,
        {
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: result.tokens.expiresIn,
        },
        "Token refreshed successfully"
      );
    } catch (error) {
      return ResponseHelper.unauthorized(res, error.message);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.getUserProfile(userId);
      return ResponseHelper.success(
        res,
        user,
        "Profile retrieved successfully"
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  /**
   * Logout endpoint (client-side token invalidation)
   */
  static async logout(req, res) {
    // Stateless JWT logout: just return success
    return ResponseHelper.success(res, null, "Logged out successfully");
  }

  /**
   * Verify token endpoint
   */
  static async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return ResponseHelper.unauthorized(res, ERROR_MESSAGES.TOKEN_REQUIRED);
      }
      const token = JwtHelper.extractToken(authHeader);
      if (!token) {
        return ResponseHelper.unauthorized(res, "Invalid authorization format");
      }
      const decoded = JwtHelper.verifyToken(token);
      const user = await UserService.getUserById(decoded.id);
      return ResponseHelper.success(
        res,
        {
          valid: true,
          user: user,
          expiresAt: new Date(decoded.exp * 1000),
        },
        "Token is valid"
      );
    } catch (error) {
      return ResponseHelper.unauthorized(res, "Invalid or expired token");
    }
  }
}

module.exports = AuthController;
