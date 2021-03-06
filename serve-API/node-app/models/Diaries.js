const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DiariesSchema = new Schema({
  creator_id: {
    type: String,
    required: true
  },
  creator_name: {
    type: String,
    required: true
  },
  dateAndTime: {
    type: String,
    required: true,
  },
  radioWeather: {
    type: String,
  },
  b_name: {
    type: String,
    required: true,
  },
  b_chapters: {
    type: String,
  },
  b_author: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required:true
  }
});
module.exports = Diaries = mongoose.model("diaries", DiariesSchema);
