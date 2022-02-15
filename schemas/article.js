const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
    articleTitle : {
        type: String,
        require: true,
    },
    articleContent : {
        type: String,
        require: true,
    },
    articleWriter : {
        type: String,
        require: true,
    },
    articleCreateTime : {
        type: String,
        require: true,
    },
    articleModifyTime : {
        type: String,
        require: true,
    }
});

module.exports = mongoose.model("Articles", articleSchema)