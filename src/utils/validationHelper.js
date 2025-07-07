// src/utils/validationHelper.js
const Joi = require("joi");
const { USER_ROLES, PASSWORD_REQUIREMENTS } = require("../config/constants");

class ValidationHelper {
  static getUserCreateSchema() {
    return Joi.object({
      fullName: Joi.string().min(2).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(PASSWORD_REQUIREMENTS.MIN_LENGTH)
        .pattern(PASSWORD_REQUIREMENTS.PATTERN)
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }),
      role: Joi.string()
        .valid(
          USER_ROLES.ADMIN,
          USER_ROLES.DESIGNER,
          USER_ROLES.SALES,
          USER_ROLES.USER
        )
        .required(),
      extras: Joi.object().optional().default({}),
    }).unknown(true);
  }

  static getUserUpdateSchema() {
    return Joi.object({
      fullName: Joi.string().min(2).max(100),
      email: Joi.string().email(),
      password: Joi.string()
        .min(PASSWORD_REQUIREMENTS.MIN_LENGTH)
        .pattern(PASSWORD_REQUIREMENTS.PATTERN)
        .messages({
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        }),
      role: Joi.string().valid(
        USER_ROLES.DESIGNER,
        USER_ROLES.SALES,
        USER_ROLES.USER
      ),
      extras: Joi.object().optional(),
    }).min(1);
  }

  static getIdSchema() {
    return Joi.number().integer().positive().required();
  }

  static getPaginationSchema() {
    return Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      sortBy: Joi.string()
        .valid("id", "fullName", "email", "role", "created_at", "updated_at")
        .default("created_at"),
      sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    });
  }

  static getLoginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }

  static validateLoginInput(data) {
    const schema = this.getLoginSchema();
    const { error } = schema.validate(data);

    if (error) {
      return {
        isValid: false,
        errors: this.formatValidationErrors(error),
      };
    }

    return { isValid: true };
  }

  static formatValidationErrors(error) {
    return error.details.map((detail) => detail.message);
  }
}

module.exports = ValidationHelper;
