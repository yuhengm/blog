const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];

/* Set up routes */

app.get("/", function (req, res) {
  res.render("home", {
    posts: posts
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

// create individual post pages
app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.toLower(req.params.postName);
  posts.forEach(function (post) {
    const storedTitle = _.toLower(post.title);
    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        // date: post.date,
        content: post.content
      });
    }
  });
});


/* Define posting actions */

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  posts.push(post);
  res.redirect("/");
});

/* Set up server */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});