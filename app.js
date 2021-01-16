const express = require('express');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

//App Config
const url = "mongodb+srv://taher_user:taher968@cluster0.ekk4x.mongodb.net/Blog?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false })
    .then(() => console.log(`Connection Successful to ${url}` ))
    .catch(err => console.log(err));

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,default: Date.now()}
});

var Blog = mongoose.model("Blog",blogSchema);

//Test Blog

// Blog.create({
//     title: "Test Blog",
//     image: "https://cdn.pixabay.com/photo/2014/10/14/20/24/the-ball-488700__480.jpg",
//     body: "The game was good but not so intense but good nonetheless"
// });

//RESTful Routes

//index route
app.get("/",(req,res) => {
    res.redirect("/blogs");
});
//index route
app.get("/blogs",(req,res) => {
    Blog.find({},(err,blogs) => {
        if(err) {
            console.log(err)
        } else {
            res.render("index",{blogs:blogs});
        }
    })
})
//new route
app.get("/blogs/new",(req,res) => {
    res.render("new");
})

//create route
app.post("/blogs",(req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newBlog) => {
        if(err) {
            console.log(err)
        } else {
            res.redirect("/blogs")
        }
    })
})

//show route
app.get("/blogs/:id",(req,res) => {
    Blog.findById(req.params.id,(err,foundBlog) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("show",{blog: foundBlog})
        }
    })
})

//edit routing
app.get("/blogs/:id/edit",(req,res) => {
    Blog.findById(req.params.id,(err,foundBlogEdit) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.render("edit",{blog:foundBlogEdit})
        }
    })
})

//update route
app.put("/blogs/:id",(req,res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//delete route
app.delete("/blogs/:id",(req,res) => {
    Blog.findByIdAndRemove(req.params.id,(err) => {
        if(err) {
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs")
        }
    })
})

const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log("Server is listening");
})
