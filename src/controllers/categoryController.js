const CategoryService = require("../services/categoryService");

module.exports = {
  async createCategory(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  },

  async getCategory(req, res, next) {
    try {
      const category = await CategoryService.getCategory(req.params.id);
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const category = await CategoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },

  async searchCategories(req, res, next) {
    try {
      const categories = await CategoryService.searchCategories(req.query.q);
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },

  async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (err) {
      next(err);
    }
  },
};
