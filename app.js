var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var EnglishofWords = [];
var CommentsArr = [];
var comments = require("./databases/comments");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./user");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");

mongoose.connect("mongodb://localhost/dictionary");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Lingze Xu will have an internship in USA soon!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


var wordsSchema = new mongoose.Schema({
    English: String,
    Chinese: String,
    Synonym: String,
    Antonym: String,
    Wordlist: Boolean,
    Comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comments"
        }
    ]
});

wordsSchema.set('autoIndex', false);

var grewords = mongoose.model("grewords", wordsSchema);

// ***********************************************************************************//
//Get the landing page.
app.get("/landing", function(req, res){
    res.render("landing");
});


//Get the homepage with a user loged in or not.
app.get("/", function(req, res){
    res.render("homepage", {currentUser: req.user});
});

// ***********************************************************************************//

//Get searchresult page from homepage.
app.post("/searchresult", function(req, res){
    var EnglishofWord = req.body.English;
    EnglishofWords.push(EnglishofWord);
    
    res.redirect("/searchresult");
});

//Post a request of adding comments from a user. "isLoggedIn" aims to ensure the comment only could be submit by a logged-in user.
app.post("/searchresult/comments", isLoggedIn, function(req, res){
    var commentsText = req.body.text;
    CommentsArr.push([commentsText, true]);
    var EnglishofWord = EnglishofWords[EnglishofWords.length - 1];
    var commentText = CommentsArr[CommentsArr.length - 1];
    
    if (CommentsArr.length > 0) {
        if (commentText[1] == true) {
            grewords.findOne({English: EnglishofWord}, function(err, word){
                if (err) {
                    console.log(err);
                } else {
                    comments.create({text: commentText[0], author: {id: req.user._id, username: req.user.username}, likes: 0, dislikes: 0}, function(err, comment){
                      if (err) {
                          console.log(err);
                      } else {
                          word.Comments.push(comment);
                          word.save();
                      }
                    });
                }
            }); 
            CommentsArr[CommentsArr.length - 1][1] = false;
        } 
    } 
    
    res.redirect("/searchresult");
})

//Post a request of likes from a user.
app.post("/searchresult/comments/likes", function(req, res) {
    var likes = req.body.likes;
    var ID = req.body.id;

    new Promise(function(resolve, reject) {
            comments.update({_id: ID}, {$set: {likes: likes}}, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Likes update successfully!");
                    resolve(comments);
                }
            });
    }).then(function(r){
        res.redirect("/searchresult");
    });
});

//Post a request of dislikes from a user.
app.post("/searchresult/comments/dislikes", function(req, res) {
    var dislikes = req.body.dislikes;
    var ID = req.body.id;

    new Promise(function(resolve, reject) {
            comments.update({_id: ID}, {$set: {dislikes: dislikes}}, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Dislikes update successfully!");
                    resolve(comments);
                }
            });
    }).then(function(r){
        res.redirect("/searchresult");
    });
});

//A user can delete the comment that she/he once made.
app.delete("/searchresult/comments/:comment_id", checkCommentOwnership ,function(req, res){
    comments.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("error", "You have no permission to do that!");
            res.redirect("/searchresult");
        }
    });
})


//Get the searchresult page with searchresult and comment system.
app.get("/searchresult", function(req, res){
    var EnglishofWord = EnglishofWords[EnglishofWords.length - 1];
    var WORDS = [];
    
    grewords.findOne({English: EnglishofWord}).populate("Comments").exec(function(err, allgrewords){
        if (err) {
            console.log(err);
        }   else {
            if (allgrewords == null || allgrewords.length < 1 || allgrewords == undefined ) {
                res.render("errorpage");
            } else {
                if (req.isAuthenticated()) {
                    User.findOne({username: req.user.username}, function(err, user){
                        if (err) {
                            console.log(err);
                        } else {
                            grewords.findOne({English: EnglishofWord}, function(err, word){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        user.words.forEach(function(Word){
                                            WORDS.push(Word.English);
                                        });
                    
                                        if (WORDS.includes(word.English)) {
                                            res.render("searchresult", {greword:allgrewords, signForUser: true});
                                    } else {
                                        res.render("searchresult", {greword:allgrewords, signForUser: false});
                                    }
                        }
            });
        }
    });
                } else {
                    res.render("searchresult", {greword:allgrewords, signForUser: "notApplicable"});
                }
            }
        }
    });
});



// ***********************************************************************************//

//Post a request of changing the words in wordlist, including two situations. One is there is a user who has already logged in,
//the other is there is no user logged in.
app.post("/wordlist", function(req, res){
    var WordName = req.body.name;
    var WordSign = req.body.sign;
    var WORDS2 = [];
    
    //req.isAuthenticated() aims to know whether there is a user or not.
    if (req.isAuthenticated()) {
        //there is a user.
        if (WordSign == "true") {
            //aims to add in wordlist
            User.findOne({username: req.user.username}, function(err, user){
                if (err) {
                    console.log(err);
                } else {
                    grewords.findOne({English: WordName}, function(err, word){
                        if (err) {
                            console.log(err);
                        } else {
                            user.words.push(word);
                            user.save();
                        }
                    })
                }
            });
        } else {
            //aims to delete from wordlist
            User.findOne({username: req.user.username}, function(err, user){
                if (err) {
                    console.log(err);
                } else {
                    grewords.findOne({English: WordName}, function(err, word){
                        if (err) {
                            console.log(err);
                        } else {
                            user.words.forEach(function(Word){
                                    WORDS2.push(Word.English);
                                        });
                            var index = WORDS2.indexOf(word.English);
                            user.words.splice(index, 1);
                            user.save();
                        }
                    })
                }
            });
        }
    } else {
        //there is no user.
        if (WordSign == "true") {
            //aims to add in wordlist.
             grewords.update({English: WordName}, {$set: {Wordlist: true}}, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("You have successfully added it to wordlist!");
                }
            });
        } else {
            //aims to delete from wordlist.
            grewords.update({English: WordName}, {$set: {Wordlist: false}}, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("You have successfully removed it away from wordlist!");
                }
            });
        }
    }
});

//Get the wordlist page, also including two situations -- 1) A user has already logged in,  2) No user has already logged in.
app.get("/wordlist", function(req, res){
    if (req.isAuthenticated()) {
        User.findOne({username: req.user.username}, function(err, user){
            if (err) {
                console.log(err);
            } else {
                res.render("wordlist", {wordsinlist: user.words, wrongWord: []});
            }
        })
    } else {
       grewords.find({Wordlist: true}, function(err, WordsInList){
        if (err) {
            console.log(err);
        } else {
            res.render("wordlist", {wordsinlist: WordsInList, wrongWord: []});
        }
    }); 
    }
});

// ***********************************************************************************//

//Get the word detector page
app.get("/detector", function(req, res){
   res.render("detector"); 
});

//parse the paragraph and get the words in our database.
app.post("/detector/result", function(req, res){
    var result = {};
    var text = req.body.paragraph.toLowerCase();
    var text2 = text.replace(/,/g, '');
    var text3 = text2.replace(/\./g, '');
    var textArr = text3.split(" ");
    
    //Use Promise.all to avoid asychronous effect of JS.
    Promise.all(textArr.map(function (word) {
        return new Promise(function (resolve, reject) {
            grewords.find({
                English: word
            }, function (err, greword) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (!(greword.length < 1 || greword == undefined)) {
                        if (word in result) {
                            result[word] = result[word] + 1;
                        } else {
                            result[word] = 1;
                        }
                    }
                    resolve(greword);
                }
            });
        });
    })).then(function (r) {
        //Get the detectorresult page with parsed words.
        res.render('detectorresult', {
            grewordObj: result
        });
    }).catch(function (err) {
        console.log('Got error ', err);
        res.status(500).send(err);
    });
});


// ***********************************************************************************//

var signArr = [0];
var wrongArr = [];
app.get("/gamepage", isLoggedIn, function(req, res){
    console.log(signArr);
    console.log(wrongArr);
            User.findOne({username: req.user.username}, function(err, user){
                if (err) {
                    console.log(err);
                } else {
                    if (signArr[signArr.length - 1] < user.words.length) {
                    
                        var WordsForReview = [];
                        var Synonym = [];
                        var i = signArr.pop();
                        var sign = i;
                        for (i; i < user.words.length; i++) {
                            if ((i - sign) < 5) {
                                    Synonym.push(user.words[i].Synonym);
                                    WordsForReview.push(user.words[i].English);
                            } else {
                                break;
                            }
                        }
                        
                        signArr.push(i);
                        
                        function getRandomInt(max) {
                             return Math.floor(Math.random() * Math.floor(max));
                        };
                        var answerNumber = getRandomInt(WordsForReview.length);
                        var synonym = Synonym[answerNumber];
    
                        // console.log(WordsForReview);
                        // console.log(answerNumber);
                        // console.log(synonym);
     
                        res.render("gamepage", {wordsForReview: WordsForReview, ans: answerNumber, synonym: synonym});
                } else {
                    res.render("wordlist", {wrongWord: wrongArr});
                    
                }
                }
            })

    });
    
app.post("/gamepage", function(req, res){
    wrongArr.push(req.body.wrongWord);
});

app.post("/gamepage/restart", function(req, res){
    console.log("comming to this part");
    var Length2 = wrongArr.length;
    
    signArr.pop();
    signArr.push(0);
    
    for (var i = 0; i < Length2; i++) {
        wrongArr.pop();
    }
    
    res.redirect("/gamepage");
});


// ***********************************************************************************//
app.get("/register", function(req, res){
   res.render("register"); 
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You have signed up successfully!");
            res.redirect("/");
        });
    });
});

// ***********************************************************************************//

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/",
    failureRedirect: "/register"
}));

app.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You have been logged out successfully!");
   res.redirect("/");
});



// ***********************************************************************************//

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }
    req.flash("error", "Please log in at first!");
    res.redirect("/login");
}


function checkCommentOwnership(req, res, next){
    if (req.isAuthenticated()) {
        comments.findById(req.params.comment_id, function(err, foundcomment){
            if (err) {
                res.redirect("back");
            } else {
                if (foundcomment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You have no permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please log in at first!");
        res.redirect("back");
    }
}





// ***********************************************************************************//

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The web page has been started!");
});


app.use(express.static("."));
//solve the problem of using "CSS style"