import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: String,
        enum: ["visible","hidden"],
        default: "visible"
    }
},{timestamps: true})

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;