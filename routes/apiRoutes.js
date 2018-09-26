var express = require("express");
var router = express.Router();
var db = require("../models/");
var cheerio = require("cheerio");
var request = require("request");

/* GET users listing. */
router.get("/scrape", function (req, res, next) {
  request("https://www.miamiherald.com/news/", function (err, resp, html) {
    var $ = cheerio.load(html);
    $("#story-list article").each(function (i, element) {
      var article = {};
      article.headLine = $(this)
        .children(".teaser")
        .children("h4")
        .children("a")
        .text();
      article.url = $(this)
        .children(".teaser")
        .children("h4")
        .children("a")
        .attr("href");
      article.summary = $(this)
        .children(".teaser")
        .children("p")
        .text();
      article.imgURL = $(this)
        .children(".teaser")
        .children(".media-body")
        .children("div")
        .children("a")
        .children(".posterframe-wrapper")
        .children("img")
        .attr("src");

      db.Article.create(article).then(function (dbArticle) {
        db.Article.find().then(function (resp) {
          res.render("index", { articles: resp });
        });
      });
    });

  });

  db.Article.find().then(function (resp) {
    res.render("index", { articles: resp });
  })

});

router.put("/article/", function (req, res) {
  var id = req.body.id;
  //   console.log(id);
  //   db.Article.findOneAndUpdate({_id: id, {$set:{saved: req.params.saved}}})
  db.Article.findOneAndUpdate({ _id: id }, { $set: { saved: true } }, function (
    err,
    doc
  ) {
    if (err) {
      console.log("Something wrong when updating data!");
    }
  });
});

router.delete("/article/", function (req, res) {
  console.log("detele hit")
  var id = req.body.id;
  db.Article.findOneAndDelete({ _id: id }).then(function (resp) {
    console.log(resp)
    res.sendStatus(200);
  })

})

router.get("/article", function (req, res) {
  db.Article.find().then(function (resp) {
    res.json(resp)
    console.log("getRoute")
  })
})

module.exports = router;
