// src/middleware/validation.js
const ValidationHelper = require("../utils/validationHelper");
const ResponseHelper = require("../utils/responseHelper");

class ValidationMiddleware {
  static validateUserCreation(req, res, next) {
    const schema = ValidationHelper.getUserCreateSchema();
    const { error } = schema.validate(req.body);
    if (error) {
      return ResponseHelper.validationError(
        res,
        ValidationHelper.formatValidationErrors(error)
      );
    }
    next();
  }

  static validateUserUpdate(req, res, next) {
    const schema = ValidationHelper.getUserUpdateSchema();
    const { error } = schema.validate(req.body);
    if (error) {
      return ResponseHelper.validationError(
        res,
        ValidationHelper.formatValidationErrors(error)
      );
    }
    next();
  }

  static validateUserId(req, res, next) {
    const schema = ValidationHelper.getIdSchema();
    const { error } = schema.validate(parseInt(req.params.id));
    if (error) {
      return ResponseHelper.validationError(res, "Invalid user ID");
    }
    req.userId = parseInt(req.params.id);
    next();
  }

  static validatePagination(req, res, next) {
    const schema = ValidationHelper.getPaginationSchema();
    const { error, value } = schema.validate(req.query);
    if (error) {
      return ResponseHelper.validationError(
        res,
        ValidationHelper.formatValidationErrors(error)
      );
    }
    req.pagination = value;
    next();
  }
}

module.exports = ValidationMiddleware;
