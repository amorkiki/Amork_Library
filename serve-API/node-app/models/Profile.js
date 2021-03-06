const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  creator_id: {
    type: String,
  },
  type: {
    type: String,
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
  remark: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  publish: {
    type: String,
  },
  pages: {
    type: Number,
  },
  current_p: {
    type: Number,
  },
  progress: {
    type: Number,
  },
  bookshelf: {
    type:String
  },
  cover_img: {
    type:String
  },
  r_status:{
    type:String
  },
  publish_date:{
    type:String
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
