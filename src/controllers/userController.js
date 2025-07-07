// src/controllers/userController.js
const UserService = require("../services/userService");
const ResponseHelper = require("../utils/responseHelper");
const {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  HTTP_STATUS,
} = require("../config/constants");

class UserController {
  static async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      return ResponseHelper.success(
        res,
        user,
        SUCCESS_MESSAGES.USER_CREATED,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      // Only handle known errors, let ResponseHelper handle the rest
      if (error.message === ERROR_MESSAGES.EMAIL_EXISTS) {
        return ResponseHelper.conflict(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getAllUsers(req, res) {
    try {
      const result = await UserService.getAllUsers(req.pagination);
      return ResponseHelper.success(
        res,
        {
          users: result.users,
          pagination: result.pagination,
        },
        SUCCESS_MESSAGES.USERS_RETRIEVED
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.userId);
      return ResponseHelper.success(res, user);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return ResponseHelper.notFound(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.userId, req.body);
      return ResponseHelper.success(res, user, SUCCESS_MESSAGES.USER_UPDATED);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return ResponseHelper.notFound(res, error.message);
      }
      if (error.message === ERROR_MESSAGES.EMAIL_TAKEN) {
        return ResponseHelper.conflict(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await UserService.deleteUser(req.userId);
      return ResponseHelper.success(res, user, SUCCESS_MESSAGES.USER_DELETED);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return ResponseHelper.notFound(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getUserByEmail(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return ResponseHelper.validationError(
          res,
          "Email query parameter is required"
        );
      }
      const user = await UserService.getUserByEmail(email);
      return ResponseHelper.success(res, user);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.USER_NOT_FOUND) {
        return ResponseHelper.notFound(res, error.message);
      }
      return ResponseHelper.error(res, error.message);
    }
  }

  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const users = await UserService.getUsersByRole(role);
      return ResponseHelper.success(
        res,
        users,
        `Users with role '${role}' retrieved successfully`
      );
    } catch (error) {
      return ResponseHelper.error(res, error.message);
    }
  }
}

module.exports = UserController;
