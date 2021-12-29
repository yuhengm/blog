const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoDB local host setup
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
  useNewUrlParser: true,
});
const postSchema = {
  title: String,
  content: String
}
const Post = mongoose.model("Post", postSchema);


/* Set up routes */

app.get("/", function (req, res) {
  Post.find({}, function (err, foundPosts) { 
    if (!err) {
      res.render("home", {
        posts: foundPosts,
      });
    } else {
      console.log(err);
    }
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
app.get("/posts/:postID", function (req, res) {
  const requestedPostId = req.params.postID;

  Post.findOne({ _id: requestedPostId }, function (err, foundPost) {
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content,
    });
  });
});


/* Define posting actions */

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function (err) {
    // Only redirect to the home page once save is complete with no errors
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  }); 
});

app.post("/delete", function (req, res) { 
  const postId = req.body.postID;
  Post.findByIdAndRemove(postId, function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

/* Set up server */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});