var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

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

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    words: [wordsSchema],
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);