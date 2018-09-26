var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
  headLine: String,
  summary: String,
  url: String,
  imgURL: String,
  saved: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
