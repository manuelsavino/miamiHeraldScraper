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
      db.Article.findOne({headLine: article.headLine}).then(resp => {
        if(!resp){
          console.log("Not FOunds, creating")
          db.Article.create(article).then(function (dbArticle) {});
        }else{
          console.log("already in there")
        }
      })
      
    });
  });

  res.sendStatus(200);
  

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

router.get("/article/:status", function (req, res) {
  var status = req.params.status
  var query = null
  if (status === "unsaved")
  {
    query = false
  }
  else{
    query = true
  }
  db.Article.find({saved: query}).then(function (resp) {
    res.json(resp)
    console.log("getRoute")
  })
})

router.get("/savedArticle", function (req, res) {
  db.Article.find({saved: true}).then(function (resp) {
    res.json(resp)
    console.log("getRoute")
  })
})

module.exports = router;
