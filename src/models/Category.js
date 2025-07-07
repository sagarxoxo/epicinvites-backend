// Category model
class Category {
  constructor(categoryData) {
    this.id = categoryData.id;
    this.name = categoryData.name;
    this.description = categoryData.description;
    this.created_at = categoryData.created_at;
    this.updated_at = categoryData.updated_at;
  }
}

module.exports = Category;
