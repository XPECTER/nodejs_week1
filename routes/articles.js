const express = require("express");
const mongoose = require("mongoose");
const Articles = require("../schemas/article");
const Comments = require("../schemas/comment");
const getTime = require("../lib/time");
const router = express.Router();


// 게시글 API
// 게시글 전체 목록 조회 (OK)
router.get("/articles", async (req, res) => {
    const articles = await Articles.find({}, 'title writer createTime')
    .sort({ createTime: -1 });    // 최신 순

    return res.json({
        articles,
    });
});

// 특정 게시글 조회 (OK)
router.get("/articles/:articleId", async (req, res) => {
    const _id = req.params.articleId
    const isValid = mongoose.Types.ObjectId.isValid(_id);

    if (!isValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const objId = mongoose.Types.ObjectId(_id)
    const article = await Articles.findById({ _id: objId });

    return res.json({
        article,
    });
});

// 게시글 작성 (OK)
router.post("/articles", async (req, res) => {
    const { title, content, writer } = req.body;
    const now = getTime();

    await Articles.create({ 
        title, 
        content,
        writer,
        createTime : now,
        modifyTime : now
    });

    return res.status(201).json({ success: true });
});

// 게시글 수정 (OK)
router.put("/articles/:articleId", async (req, res) => {
    const _id = req.params.articleId
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    if (!isValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const objId = mongoose.Types.ObjectId(_id)
    const { title, content, writer } = req.body;

    const existsArticle = await Articles.findOne( { _id : objId });
    if (!existsArticle)
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });

    const now = getTime();
    await Articles.updateOne({ _id : objId }, { $set : { 
        title,
        content,
        writer,
        modifyTime : now
    } });

    return res.status(200).json({ success: true })
});

// 게시글 삭제 (OK)
router.delete("/articles/:articleId", async (req, res) => {
    const _id = req.params.articleId
    const isValid = mongoose.Types.ObjectId.isValid(_id);

    if (!isValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const objId = mongoose.Types.ObjectId(_id)
    const existsArticle = await Articles.findOne( { _id : objId });
    if (!existsArticle)
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });

    await Articles.deleteOne({ _id : articleId });              // 지우는 건 위험하지 않나 
    // await Comments.deleteMany({ articleId: articleId });     // 전에는 기록을 보관해야하기 때문에 DB에서 지우지 않고 deleteTable을 만들어서 월 단위로 저장을 했었다.
    return res.json({ success: true }); // deleteat
});


// 댓글 API
// 댓글 조회
router.get("/articles/:articleId/comments", async (req, res) => {
    const _id = req.params.articleId
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    
    if (!isValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const objId = mongoose.Types.ObjectId(_id)
    const existsArticle = await Articles.findById({ _id: objId });

    if (existsArticle.length == 0)
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });

    const comments = await Comments.find({ articleId: objId }).sort({ commentCreateDate: -1 })
    return res.json({ 
        comments,
    });
});

// 댓글 작성
router.post("/articles/:articleId/comments", async (req, res) => {
    const _id = req.params.articleId
    const isValid = mongoose.Types.ObjectId.isValid(_id);
    
    if (!isValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const objId = mongoose.Types.ObjectId(_id)
    const { writer, content } = req.body;

    if (content.length === 0)
        return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요." });

    const existsArticle = await Articles.findOne( { _id : objId });
    
    if (existsArticle.length === 0)
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });

    const now = getTime();
    await Comments.create({ 
        articleId: objId,
        writer, 
        content,
        createDate: now,
        modifyDate: now
    });

    return res.status(201).json({ success: true })
});

// 댓글 수정
router.put("/articles/:articleId/comments/:commentId", async (req, res) => {
    const { content } = req.body;

    if (!content.length) 
        return res.status(400).json({ success: false, errorMessage: "댓글 내용을 입력해주세요."});

    const articleId = req.params.articleId
    const articleIsValid = mongoose.Types.ObjectId.isValid(articleId);
    const commentId = req.params.commentId
    const commentIsValid = mongoose.Types.ObjectId.isValid(articleId);

    if (!articleIsValid || !commentIsValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const articleObjectId = mongoose.Types.ObjectId(articleId)
    const commentObjectId = mongoose.Types.ObjectId(commentId);

    const existsComment = await Comments.find({ _id: commentObjectId, articleId: articleObjectId });
    if (existsComment.length === 0)
        return res.status(400).json({ success: false, message: "존재하지 않는 댓글입니다." });

    const now = getTime();
    await Comments.updateOne({ _id: commentId }, { $set : {
        content,
        modifyTime: now
    }});

    return res.json({ success: true });
});

// 댓글 삭제
router.delete("/articles/:articleId/comments/:commentId", async (req, res) => {
    const articleId = req.params.articleId
    const articleIsValid = mongoose.Types.ObjectId.isValid(articleId);
    const commentId = req.params.commentId
    const commentIsValid = mongoose.Types.ObjectId.isValid(articleId);

    if (!articleIsValid || !commentIsValid)
        return res.status(400).json({success: false, errorMessage: "TypeError"});
    
    const articleObjectId = mongoose.Types.ObjectId(articleId)
    const commentObjectId = mongoose.Types.ObjectId(commentId);

    const existsComment = await Comments.find({ _id: commentObjectId, articleId: articleObjectId });
    if (existsComment.length === 0) {
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 댓글입니다." });    
    }

    await Comments.deleteOne({ _id: commentId });
    return res.json({ success: true });
});

module.exports = router;