const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    articleId : {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    commentWriter : {
        type: String,
        require: true,
    },
    commentContent : {
        type: String,
        require: true,
    },
    commentCreateDate : {
        type: String,
        require: true,
    },
    commentModifyDate : {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model("Comments", commentSchema)