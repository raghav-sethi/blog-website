//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Connecting to mongo db
mongoose.connect("mongodb://localhost:27017/blogDB");

//Creating Schema for blog post
const blogSchema = new mongoose.Schema({
  postTitle: String,
  postContent: String,
  postDate: String,
  lastUpdateOn: Date,
  // comments: [{ commentBody: String, commentDate: Date }],
  likes: Number,
});

//Creating model using blog schema
const Blog = mongoose.model("Blog", blogSchema);

//Global array to store all posts in
const posts = [];

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Rendering home page
app.get("/", (req, res) => {
  Blog.find({}, (err, searchedBlogs) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(searchedBlogs);
      res.render("home", {
        startContent: homeStartingContent,
        blogs: searchedBlogs,
      });
    }
  });

  // console.log(posts);
});

//Rendering about page
app.get("/about", (req, res) => {
  res.render("about", { startContent: aboutContent });
});

//Rendering contact page
app.get("/contact", (req, res) => {
  res.render("contact", { startContent: contactContent });
});

//Rendering compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

//Post route for compose page
app.post("/compose", (req, res) => {
  //Parsing Title of the blog
  const blogTitle = req.body.blogTitle;
  const blogContent = req.body.blogContent;
  // console.log(blogTitle);
  // console.log(blogContent);

  //creating post object to store both title and content
  // const post = {
  //   title: blogTitle,
  //   content: blogContent,
  // };
  // console.log(post);

  //Pushing post to array posts
  // posts.push(post);

  const today = new Date();
  const date = `${today.getDate()} - ${today.getMonth()} - ${today.getFullYear()}`;

  // console.log(date);

  //Sending the post data to the db
  const newPost = new Blog({
    postTitle: blogTitle,
    postContent: blogContent,
    postDate: date,
  });

  newPost.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });

  // console.log(newPost);
  //redirecting to home route
});

//Custom route with params
app.get("/posts/:postId", (req, res) => {
  // console.log(req.params.postName);

  //Finding post according to params
  // posts.forEach((post) => {
  //   if (_.lowerCase(post.title) === _.lowerCase(req.params.postName)) {
  //     //Rendering post page
  //     res.render("post", { post: post });
  //   }
  // });

  Blog.findOne({ _id: req.params.postId }, (err, searchedBlog) => {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        startContent: homeStartingContent,
        blog: searchedBlog,
      });
    }
  });
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
