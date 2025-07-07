// src/services/userService.js
const supabase = require("../config/database");
const User = require("../models/User");
const PasswordHelper = require("../utils/passwordHelper");
const JwtHelper = require("../utils/jwtHelper");
const { ERROR_MESSAGES } = require("../config/constants");

class UserService {
  static async createUser(userData) {
    const { fullName, email, password, role, extras = {} } = userData;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      throw new Error(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    // Hash password
    const hashedPassword = await PasswordHelper.hashPassword(password);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: fullName,
          email: email,
          password: hashedPassword,
          role: role,
          extras: extras,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return new User(data);
  }

  static async getAllUsers(pagination = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
    } = pagination;
    const offset = (page - 1) * limit;

    // Get total count
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Get users with pagination
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    const users = data.map((user) => new User(user));

    return {
      users,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
        hasNextPage: page < Math.ceil(count / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      throw new Error(`Database error: ${error.message}`);
    }

    return new User(data);
  }

  static async updateUser(userId, updateData) {
    const updates = { updated_at: new Date().toISOString() };

    // Add fields to update
    if (updateData.fullName) updates.full_name = updateData.fullName;
    if (updateData.email) {
      // Check if email is already taken by another user
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", updateData.email)
        .neq("id", userId)
        .single();

      if (existingUser) {
        throw new Error(ERROR_MESSAGES.EMAIL_TAKEN);
      }

      updates.email = updateData.email;
    }
    if (updateData.password) {
      updates.password = await PasswordHelper.hashPassword(updateData.password);
    }
    if (updateData.role) updates.role = updateData.role;
    if (updateData.extras !== undefined) updates.extras = updateData.extras;

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return new User(data);
  }

  static async deleteUser(userId) {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .select("id, full_name, email, role")
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!data) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return new User(data);
  }

  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      throw new Error(`Database error: ${error.message}`);
    }

    return new User(data);
  }

  static async getUsersByRole(role) {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, extras, created_at, updated_at")
      .eq("role", role)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data.map((user) => new User(user));
  }

  // Authentication methods
  static async authenticate(email, password) {
    // Get user by email including password
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, full_name, email, password, role, extras, created_at, updated_at"
      )
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Verify password
    const isValidPassword = await PasswordHelper.comparePassword(
      password,
      data.password
    );
    if (!isValidPassword) {
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Create user object (without password)
    const user = new User({
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      extras: data.extras,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    // Generate JWT tokens
    const tokens = JwtHelper.generateAuthTokens(user);

    return { user, tokens };
  }

  static async refreshToken(refreshToken) {
    try {
      const decoded = JwtHelper.verifyToken(refreshToken);
      const user = await this.getUserById(decoded.id);
      const tokens = JwtHelper.generateAuthTokens(user);
      return { user, tokens };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  static async getUserProfile(userId) {
    return this.getUserById(userId);
  }
}

module.exports = UserService;
