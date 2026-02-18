import Comment from "../models/Comment.js";

const addComment = async(req, res)=>{
    const { videoID, content } = req.body

    const comment = await Comment.create({
        videoID,
        userID: req.user.id,
        content
    })

    res.status(201).json(comment)
}

const getVideoComments = async(req, res)=>{
    const comments = await Comment.find({
        videoID,
        status: "visible"
    }).populate("userID", "username")
    .sort({createdAt: -1})

    res.json(comments)
}


export { addComment, getVideoComments }