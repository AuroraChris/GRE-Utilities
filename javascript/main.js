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

