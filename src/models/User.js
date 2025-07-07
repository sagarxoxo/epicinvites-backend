// src/models/User.js
const { USER_ROLES } = require("../config/constants");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated user ID
 *           example: 1
 *         fullName:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: User's password (min 8 chars, must contain uppercase, lowercase, number, and special character)
 *           example: "SecurePass123!"
 *           minLength: 8
 *         role:
 *           type: string
 *           enum: [admin, designer, sales, user]
 *           description: User's role
 *           example: "designer"
 *         extras:
 *           type: object
 *           description: Additional user data stored as JSON
 *           example: {"inviteData": {}}
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         full_name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         role:
 *           type: string
 *           example: "designer"
 *         extras:
 *           type: object
 *           example: {"inviteData": {}}
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "SecurePass123!"
 *         role:
 *           type: string
 *           enum: [designer, sales, user]
 *           example: "designer"
 *         extras:
 *           type: object
 *           description: Additional user data stored as JSON
 *           example: {"inviteData": {}}
 *
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Updated"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.updated@example.com"
 *         password:
 *           type: string
 *           example: "NewSecurePass123!"
 *         role:
 *           type: string
 *           enum: [designer, sales, user]
 *           example: "sales"
 *         extras:
 *           type: object
 *           description: Additional user data stored as JSON
 *           example: {"inviteData": {}}
 *
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *         error:
 *           type: string
 *           example: "Error message"
 *         count:
 *           type: integer
 *           example: 10
 */

class User {
  constructor(userData) {
    this.id = userData.id;
    this.fullName = userData.full_name || userData.fullName;
    this.email = userData.email;
    this.role = userData.role;
    this.extras = userData.extras || {};
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  // Static method to validate role
  static isValidRole(role) {
    return Object.values(USER_ROLES).includes(role);
  }

  // Static method to get allowed roles for API creation
  static getAllowedApiRoles() {
    return [USER_ROLES.DESIGNER, USER_ROLES.SALES, USER_ROLES.USER];
  }

  // Method to check if user is admin
  isAdmin() {
    return this.role === USER_ROLES.ADMIN;
  }

  // Method to format user data for API response (exclude sensitive info)
  toJSON() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      extras: this.extras,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;
