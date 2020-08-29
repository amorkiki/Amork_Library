const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const CategoriesSchema = new Schema({
  cate_name: {
    type: String,
    required: true,
  },
  children: {
    type: Array,
  },
  cat_level: {
    type: Number,
  },
});
module.exports = Categories = mongoose.model("categories", CategoriesSchema);
