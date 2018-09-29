var express = require("express");
var router = express.Router();
var db = require("../models");

/* GET home page. */
router.get("/", function (req, res) {
  db.Article.find().then(function (resp) {
    res.render("index");
  });
});


router.get("/saved", function (req, res) {

  db.Article.find({ saved: true }).then(function (resp) {
    res.render("saved");
  });
  // res.render("saved")
})



module.exports = router;
