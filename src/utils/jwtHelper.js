// src/utils/jwtHelper.js
const jwt = require("jsonwebtoken");
const { JWT } = require("../config/constants");

class JwtHelper {
  /**
   * Generate JWT token for user
   * @param {Object} payload - User data to include in token
   * @param {string} expiresIn - Token expiration time
   * @returns {string} JWT token
   */
  static generateToken(payload, expiresIn = JWT.EXPIRES_IN) {
    try {
      return jwt.sign(payload, JWT.SECRET, {
        expiresIn,
        algorithm: JWT.ALGORITHM,
      });
    } catch (error) {
      throw new Error("Error generating token");
    }
  }

  /**
   * Generate refresh token for user
   * @param {Object} payload - User data to include in token
   * @returns {string} Refresh JWT token
   */
  static generateRefreshToken(payload) {
    try {
      return jwt.sign(payload, JWT.SECRET, {
        expiresIn: JWT.REFRESH_EXPIRES_IN,
        algorithm: JWT.ALGORITHM,
      });
    } catch (error) {
      throw new Error("Error generating refresh token");
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT.SECRET, {
        algorithms: [JWT.ALGORITHM],
      });
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      }
      if (error.name === "NotBeforeError") {
        throw new Error("Token not active");
      }
      throw new Error("Token verification failed");
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   * @param {string} token - JWT token to decode
   * @returns {Object} Decoded token payload
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error("Error decoding token");
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} JWT token or null
   */
  static extractToken(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  /**
   * Generate tokens for user authentication
   * @param {Object} user - User object
   * @returns {Object} Access token and refresh token
   */
  static generateAuthTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName || user.full_name,
    };

    const accessToken = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT.EXPIRES_IN,
    };
  }

  /**
   * Check if user has required role
   * @param {Object} user - User object from token
   * @param {string|Array} requiredRoles - Required role(s)
   * @returns {boolean} True if user has required role
   */
  static hasRole(user, requiredRoles) {
    if (!user || !user.role) {
      return false;
    }

    const roles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    return roles.includes(user.role);
  }

  /**
   * Check if user is admin
   * @param {Object} user - User object from token
   * @returns {boolean} True if user is admin
   */
  static isAdmin(user) {
    return user && user.role === "admin";
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token to check
   * @returns {boolean} True if token is expired
   */
  static isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null if invalid
   */
  static getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate token format and structure
   * @param {string} token - JWT token to validate
   * @returns {boolean} True if token format is valid
   */
  static isValidTokenFormat(token) {
    if (!token || typeof token !== "string") {
      return false;
    }

    const parts = token.split(".");
    return parts.length === 3;
  }
}

module.exports = JwtHelper;
