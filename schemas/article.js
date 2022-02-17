const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
    title : {
        type: String,
        require: true,
    },
    content : {
        type: String,
        require: true,
    },
    writer : {
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

module.exports = mongoose.model("Articles", articleSchema)