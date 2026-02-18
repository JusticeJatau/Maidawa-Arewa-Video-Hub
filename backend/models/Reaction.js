import mongoose from "mongoose"

const reactionSchema = new mongoose.Schema({
    videoID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    type:{
        type: String,
        enum: ["like","dislike"],
        required: true
    }
}, {timestamps: true})

reactionSchema.index({videoID: 1, userID: 1})

const Reaction = mongoose.model("Reaction", reactionSchema);
export default Reaction;