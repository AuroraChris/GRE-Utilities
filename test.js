
var mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/dictionary");

var wordsSchema = new mongoose.Schema({
    English: String,
    Chinese: String,
    Synonym: String,
    Antonym: String,
    Wordlist: Boolean
});

var grewords = mongoose.model("grewords", wordsSchema);

grewords.update({English: "abstemious"}, {$set: {Wordlist: true}}, function(err){
   if (err) {
       console.log(err);
   } else {
       console.log("done");
   }
});