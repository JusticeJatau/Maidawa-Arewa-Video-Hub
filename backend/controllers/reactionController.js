import Reaction from "../models/Reaction.js";

const reactToVideo = async(req, res) =>{
    const {videoID, type} = req.body

    const reaction = await Reaction.findOneAndUpdate({
        videoID,
        userID: req.user.id
    },
    {type},
    {new: true, upsert: true}
    )

    res.json(reaction)
}

export {reactToVideo}