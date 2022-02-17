const mongoose = require("mongoose");

const connect = () => {
    mongoose.connect("mongodb://localhost:27017/pbl_week1", { ignoreUndefined: true }).catch((err) => {
        console.error(err);
    });
};

module.exports = connect;
