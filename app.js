const express = require("express");
const connect = require("./schemas/index");
const app = express();
const port = 3000;

connect();

const articlesRouter = require("./routes/articles");

const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};

app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware);

app.use("/api", [articlesRouter]);

app.get("/", (req, res) => {
    res.send("Hello. Backend.");
});

app.listen(port, () => {
    console.log("Port : ", port, " Listening..");
});