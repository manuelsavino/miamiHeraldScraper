var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var PORT = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/miamiHerald",
  { useNewUrlParser: true }
);

var indexRouter = require("./routes/index");
var apiRoutes = require("./routes/apiRoutes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRoutes);

app.listen(PORT, function () {
  console.log("were live")
})
