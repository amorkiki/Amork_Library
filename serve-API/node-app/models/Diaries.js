const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiariesSchema = new Schema({
  user: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  weather: {
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

    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
module.export = Diaries = mongoose.model("diaries", DiariesSchema);
