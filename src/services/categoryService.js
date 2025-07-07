// Service for Category CRUD
const db = require("../config/database");
const Category = require("../models/Category");

module.exports = {
  async createCategory(data) {
    const [result] = await db.query(
      "INSERT INTO categories (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
      [data.name, data.description]
    );
    return new Category({
      id: result.insertId,
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
  },

  async deleteCategory(id) {
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
  },

  async getCategory(id) {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows.length ? new Category(rows[0]) : null;
  },

  async updateCategory(id, data) {
    await db.query(
      "UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?",
      [data.name, data.description, id]
    );
    return this.getCategory(id);
  },

  async searchCategories(text) {
    const [rows] = await db.query(
      "SELECT * FROM categories WHERE name LIKE ? OR description LIKE ?",
      [`%${text}%`, `%${text}%`]
    );
    return rows.map((row) => new Category(row));
  },

  async getAllCategories() {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows.map((row) => new Category(row));
  },
};
