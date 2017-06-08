//dependencies 
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
//require Note & Article models 
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
//scraping tools
var request = require("request");
var cheerio = require("cheerio");
//set mongoose to leverage built in JavaScript ES6 Promises 
mongoose.Promise = Promise;

//initialize express 
var app = express();

var Port = process.env.PORT || 3000;

//use morgan and body-parser with out app 
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));

//make public a static dir
app.use(express.static("public"));

//db config with mongoose
mongoose.connect("mongodb://localhost/mongooseHW");
var db = mongoose.connection;

//log in case of errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

//once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

//ROUTES 

//GET request to scrape CNN website
app.get("/scrape", function(req, res) {
    console.log('hello')
    request("http://money.cnn.com/technology/gadgets/", function(error, response, html) {

        //loads the body of the html to cheerio and saves it to var $. 
        var $ = cheerio.load(html);
        //grabs every h2 within an article tag, and do the follow:

        $("a").each(function(i, element) {

            // console.log("i", i);
            // console.log("element", element);

            //filter class _2HBM5 for every a tag in element
            $(this).filter(function(i, el) {

                //if found, grab the title and link 
                if ($(this).attr('class') === '_2HBM5') {
                    var filteredATag = $(this);

                    // console.log("filteredATag", filteredATag);
                    //saves an empty result object
                    var result = {};
                    //adds the text and href of every link, and saves them as properties of the result object 
                    result.title = $(this).text();
                    result.link = $(this).attr("href");

                    //Create a new entry, using the Article model, and passes the resul object to the entry (and the title and link)
                    // console.log("TRYING AGAIN: ", result);
                    var entry = new Article(result);
                    //saves that entry to the db 
                    entry.save(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(doc);
                        }
                    });

                };
            });



        });
    });

    //tell the browser that we finished scraping the text 
    res.send("Scrape Complete");
});

//Get the articles scraped from mongoDB
app.get("/articles", function(req, res) {
    //grab every doc in the Articles array
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

//grab an article by it's ObjectId 
app.get("/articles/:id", function(req, res) {
    //using the id passed in the id parameter, prepare a query that finds the matching one in our db... 
    Article.findOne({ "_id": req.params.id })
        // and populate all of the notes assoc. w/ it 
        .populate("note")
        //execute the query
        .exec(function(error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }
        });
});

//create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
    //create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);

    //save the new note to the db
    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            //use the article id to find and update it's note
            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                //execute the above query 
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }
                });
        }
    });
});

app.listen(Port, function() {
    console.log("App running on port " + Port);
});
