import Comment from "../models/Comment.js";
import mongoose from 'mongoose'

const addComment = async(req, res)=>{
    const videoId = req.params.id;
    const { content } = req.body;

    const comment = await Comment.create({
        videoId,
        userId: req.user.id,
        content
    })
    await comment.populate("userId", "name");

    res.status(201).json(comment)
}

const getVideoComments = async(req, res)=>{
    const videoId = req.params.id;

    const comments = await Comment.find({
        videoId: new mongoose.Types.ObjectId(videoId),
        status: "visible"
    }).populate("userId", "name")
    .sort({createdAt: -1})

    res.json(comments)
}


export { addComment, getVideoComments }