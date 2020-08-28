const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  b_name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn_num: {
    type: String,
  },
  status: {
    type: String,
  },
  remark: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
