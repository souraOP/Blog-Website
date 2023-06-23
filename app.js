//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const homePage = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores ex culpa voluptatum rerum ea itaque, esse minima totam voluptatibus praesentium hic vitae alias accusamus in labore voluptatem quaerat quisquam repudiandae.";
const aboutContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores ex culpa voluptatum rerum ea itaque, esse minima totam voluptatibus praesentium hic vitae alias accusamus in labore voluptatem quaerat quisquam repudiandae.";
const contactContent = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores ex culpa voluptatum rerum ea itaque, esse minima totam voluptatibus praesentium hic vitae alias accusamus in labore voluptatem quaerat quisquam repudiandae.";

const app = express();

//connecting to the mongodb shell
mongoose.connect("mongodb://localhost:27017/blogDB");



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//creating the schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

//creating the mongoose model
const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
  Post.find({}).then(function(posts){
    res.render("home", {
      homeContent: homePage,
      posts: posts
    });
  }).catch(function(err){
    console.log(err);
  });

});

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", (req, res)=>{
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", (req, res)=>{
  res.render("compose");
});


app.post('/compose', function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}).then(function(post){
    res.render("post", {
      title: post.title ,
      content: post.content
    });
  }).catch(function(err){
    console.log(err);
  });
});



app.listen("3000", function(){
  console.log("App running on port 3000");
})
