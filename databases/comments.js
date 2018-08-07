var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/dictionary");

var commentsSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    dislikes: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

module.exports = mongoose.model("comments", commentsSchema);
