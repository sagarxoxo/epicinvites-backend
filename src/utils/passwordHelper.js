// src/utils/passwordHelper.js
const bcrypt = require("bcryptjs");
const { BCRYPT, PASSWORD_REQUIREMENTS } = require("../config/constants");

class PasswordHelper {
  static async hashPassword(password) {
    return bcrypt.hash(password, BCRYPT.SALT_ROUNDS);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static validatePasswordStrength(password) {
    const errors = [];

    if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
      errors.push(
        `Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`
      );
    }

    if (!PASSWORD_REQUIREMENTS.PATTERN.test(password)) {
      errors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }

    return errors;
  }
}

module.exports = PasswordHelper;
