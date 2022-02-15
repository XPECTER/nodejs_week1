const express = require("express");
const mongoose = require("mongoose");
const Articles = require("../schemas/article");
const Comments = require("../schemas/comment");
const router = express.Router();


// 게시글 API
// 게시글 전체 목록 조회 (OK)
router.get("/articles", async (req, res) => {
    const articles = await Articles.find({}, 'articleTitle articleWriter articleCreateTime')
    .sort({ articleCreateTime: -1 });    // 최신 순

    return res.json({
        articles,
    });
});

// 특정 게시글 조회
router.get("/articles/:articleId", async (req, res) => {
    const  articleId  = mongoose.Types.ObjectId(req.params.articleId);
    const article = await Articles.findById({ _id: articleId });

    return res.json({
        article,
    });
});

// 게시글 작성 (OK)
router.post("/articles", async (req, res) => {
    const { articleTitle } = req.body;
    const { articleContent } = req.body;
    const { articleWriter } = req.body;
    const now = new Date();

    await Articles.create({ 
        articleTitle, 
        articleContent,
        articleWriter,
        articleCreateTime : now.toLocaleString('ko-KR'),
        articleModifyTime : now.toLocaleString('ko-KR')
    });

    return res.status(201).json({ success: true });
});

// 게시글 수정 (OK)
router.put("/articles/:articleId", async (req, res) => {
    const articleId = mongoose.Types.ObjectId(req.params.articleId);
    const { articleTitle } = req.body;
    const { articleContent } = req.body;
    const { articleWriter } = req.body;
    const now = new Date();

    const existsArticle = await Articles.findOne( { _id : articleId });
    if (existsArticle) {
        await Articles.updateOne({ _id : articleId }, { $set : { 
            articleTitle,
            articleContent,
            articleWriter,
            articleModifyTime : now.toLocaleString('ko-KR')
        } });
        return res.status(200).json({ success: true })
    } else {
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });
    }
});

// 게시글 삭제 (OK)
router.delete("/articles/:articleId", async (req, res) => {
    const articleId = mongoose.Types.ObjectId(req.params.articleId);

    const existsArticle = await Articles.findOne( { _id : articleId });
    if (existsArticle) {
        await Articles.deleteOne({ _id : articleId });              // 지우는 건 위험하지 않나 
        // await Comments.deleteMany({ articleId: articleId });     // 전에는 기록을 보관해야하기 때문에 DB에서 지우지 않고 deleteTable을 만들어서 월 단위로 저장을 했었다.
        return res.json({ success: true });
    } else {
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });
    }
});


// 댓글 API
// 댓글 조회
router.get("articles/:articleId/comment", async (req, res) => {
    const articleId = mongoose.Types.ObjectId(req.params.articleId);

    const existsArticle = await Articles.findById({ _id: articleId });
    if (existsArticle) {
        const comments = await Comments.find({ articleId: articleId })
        return res.json({ 
            comments,
        });
    } else {
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });
    }
});

// 댓글 작성
router.post("articles/:articleId/comment", async (req, res) => {
    const articleId = mongoose.Types.ObjectId(req.params.articleId);
    const { commentWriter } = req.body;
    const { commentContent } = req.body;
    const now = new Date();

    console.log(articleId, commentWriter, commentContent);

    const existsArticle = await Articles.findOne( { _id : articleId });
    if (existsArticle) {
        await Comments.create({ 
            articleId,
            commentWriter, 
            commentContent,
            commentCreateDate: now.toLocaleString('ko-KR'),
            commentModifyDate: now.toLocaleString('ko-KR')
        });
    
        return res.status(201).json({ success: true })
    } else {
        return res.status(400).json({ success: false, errorMessage: "존재하지 않는 게시글입니다." });
    }
});

// 댓글 수정
router.put("articles/:articleId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { commentContent } = req.body

    const existsComment = await Comments.findOne({ commentID: Number(commentId) });
    if (existsComment) {
        await Comments.updateOne({ commentId: Number(commentId) }, { $set : {
            commentContent,
        }});
    } else {
        return res.json({ success: false, message: "존재하지 않는 댓글입니다." });
    }
});

// 댓글 삭제
router.delete("/articles/:articleId/comments/:commentId", async (req, res) => {
    const articleId = mongoose.Types.ObjectId(req.params.articleId);
    const commentId = mongoose.Types.ObjectId(req.params.commentId);

    const existsComment = await Comments.findById( { commentId: commentId });
    if (existsComment) {
        await Comments.deleteOne({ commentID: commentId });
    }

    res.json({ success: true });
});

module.exports = router;