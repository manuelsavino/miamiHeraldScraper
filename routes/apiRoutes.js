var express = require("express");
var router = express.Router();
var db = require("../models/");
var cheerio = require("cheerio");
var request = require("request");

/* GET users listing. */
router.get("/scrape", function (req, res) {
  var results = []
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

      results.push(article)
    });//ends each loop

    function saveToDb(results) {


      return new Promise((resolve, reject) => {
        results.forEach(e => {
          db.Article.findOne({ headLine: e.headLine }, (err, resp) => {
            if (err) {
              console.log(err)
            }
            if (!resp) {
              db.Article.create(e, function (err, dbArticle) {
                if (err) {
                  console.log(err)
                }
              });
            } else {
              console.log("already in there")
            }
          })//ends findOne 
        })
        resolve()
      })
    }//ends savetoDb function
    saveToDb(results).then(res.redirect("/"))
  });




});

router.put("/article/", function (req, res) {
  console.log("saving Article")
  var id = req.body.id;
  db.Article.findOneAndUpdate({ _id: id }, { $set: { saved: true } }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
      res.sendStatus(500)
    }
    else {
      res.sendStatus(200)
    }
  });
});

router.delete("/article/", function (req, res) {
  var id = req.body.id;
  db.Article.findOneAndDelete({ _id: id }).then(function (resp) {
    console.log(resp)
    res.sendStatus(200);
  })

})

//get all articles based on saved or not status
router.get("/article/status/:status", function (req, res) {
  var status = req.params.status
  var query = null
  if (status === "unsaved") {
    query = false
  }
  else {
    query = true
  }
  db.Article.find({ saved: query }).then(function (resp) {
    res.json(resp)
  })
})

router.get("/article/:id", function (req, res) {
  var id = req.params.id
  db.Article.findOne({ _id: id }).populate("note").exec(function (err, resp) {
    res.json(resp)
  })
})


router.post("/article/note", function (req, res) {
  console.log("post route hi")
  console.log(req.body)

  db.Note.create({ body: req.body.body }, function (err, note) {
    db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { note: note._id } })
      .then(function (updatedArtice) {
        res.sendStatus(200)
      })
  })

})

router.delete("/note", function (req, res) {
  var id = req.body.id;
  db.Note.findOneAndDelete({ _id: id }).then(function (resp) {
    res.sendStatus(200);
  })
});

module.exports = router;
