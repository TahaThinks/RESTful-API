
// jshint esversion:6

// Require all the modules innstalled:
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const res = require("express/lib/response");

// Initializing Express:
const app = express();
app.use(express.static("public"));

// Setting body-parser:
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// Setting MongoDB Server: -> (The useNewUrlParser is used to ignore 
// all mongoDB warnings it gives)
// The below line allow mongoose to connect to our local mongoDB istance
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// Create the Schema for article collection
const articleSchema = {
    title: String,
    content: String
}

// Create our Model, specify the name of our collection and select
// the schema this collection should follow.
// keep in mind the Article inside the .model will be made plural by
// mongoose and make it lower case article.
const Article = mongoose.model("Article", articleSchema);

///////////////////////////// Request Targeting all articles:
app.route("/articles")
    .get(function(req, res){
    
        Article.find({}, function(err, foundArticles){
    
            if(!err)
            {
                res.send(foundArticles);
            }
            else
            {
                res.send(err);
            }
        });
    })

    .post(function(req,res){
    
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save(function(err){
            if(!err)
            {
                res.send("Successfully added a new article.");
            }
            else
            {
                res.send(err);
            }
        });
    })

    .delete(function(req, res){

        Article.deleteMany({}, function(err){
            if(!err)
            {
                res.send("Successfully deleted all articles");
            }
            else
            {
                res.send(err);
            }
        });
});


///////////////////////////// Request Targeting a specific article
app.route("/articles/:articleTitle")
    .get(function(req , res){
       
        Article.findOne({title:  req.params.articleTitle}, function(err, foundArticle){
              if(foundArticle)
              {
                  res.send(foundArticle);
              }
              else
              {
                  res.send("No articles matching that title was found.");
              }          
        });
    })
    .put(function(req, res){
        Article.replaceOne( {title: req.params.articleTitle},
                        
                        {
                         title: req.body.title,
                         content: req.body.content
                        },

                        {overwrite: true},

                        function(err){
                            if(!err)
                            {
                                res.send("Successfully updated article.");
                            }
                            else
                            {
                                res.send(err);
                            }
                        });
    })
    .patch(function(req,res){
        Article.updateOne( {title: req.params.articleTitle},
                            {$set: req.body},
                            function(err){
                                if(!err)
                                {
                                    res.send("Successfully updated article.");
                                }
                                else
                                {
                                    res.send(err);
                                }
                            });
    })
    .delete(function(req,res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if(!err)
            {
                res.send("Successfully removed the article");
            }
            else
            {
                res.send(err);
            }
        });
    });



//Activate Server to Listen at port 3000:
app.listen(3000, function(){
    console.log("Server startrd on port 3000");
});







// GET Request:
// app.get("/articles", function(req, res){
    
//     Article.find({}, function(err, foundArticles){

//         if(!err)
//         {
//             res.send(foundArticles);
//         }
//         else
//         {
//             res.send(err);
//         }
//     });
// });

// // POST Request:
// app.post("/articles", function(req,res){
    
//     const newArticle = new Article ({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function(err){
//         if(!err)
//         {
//             res.send("Successfully added a new article.");
//         }
//         else
//         {
//             res.send(err);
//         }
//     });
// });


// // DELETE Rrquest:
// app.delete("/articles", function(req, res){

//     Article.deleteMany({}, function(err){
//         if(!err)
//         {
//             res.send("Successfully deleted all articles");
//         }
//         else
//         {
//             res.send(err);
//         }
//     });
// });

