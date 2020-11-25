const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const BookshelfSchema = new Schema({
  shelf_name: {
    type: String,
    required: true,
  },
  // shelf_children: {
  //   type: Array,
  // },
  shelf_level: {
    type: Number,
    default:0
  },
});
module.exports = Bookshelf = mongoose.model("bookshelf", BookshelfSchema);
