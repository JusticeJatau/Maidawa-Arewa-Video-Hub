import Reaction from "../models/Reaction.js";

const reactToVideo = async(req, res) =>{
    const { type } = req.body
    console.log("Reacted: ", type)

    const reaction = await Reaction.findOneAndUpdate({
        videoId: req.params.id,
        userId: req.user.id
    },
    {type},
    {new: true, upsert: true}
    )

    res.json(reaction)
}

export {reactToVideo}