const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    articleId : {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    writer : {
        type: String,
        require: true,
    },
    content : {
        type: String,
        require: true,
    },
    createTime : {
        type: String,
        require: true,
    },
    modifyTime : {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model("Comments", commentSchema)