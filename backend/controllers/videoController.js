import Video from "../models/Video.js";

const createVideo = async (req, res) => {
   console.log(req.body)
  try {
    const {
      title,
      description,
      category,
      source,
      videoUrl,
      thumbnailUrl,
      status
    } = req.body;

    let videoData = {
      title,
      description,
      category,
      source,
      thumbnailUrl,
      status,
      createdBy: req.user.id
    };

    if (source === "youtube") {
      if (!videoUrl) {
        return res.status(400).json({ message: "videoUrl is required" });
      }

      videoData.videoUrl = videoUrl;
    } else if (source === "upload") {
      if (!req.files || !req.files.video) {
         return res.status(400).json({ message: "Video file is required" });
      }

      const videoFile = req.files.video[0];
      videoData.videoUrl = `/uploads/videos/${videoFile.filename}`;

      if (req.files.thumbnail) {
         const thumbFile = req.files.thumbnail[0];
         videoData.thumbnailUrl = `/uploads/videos/${thumbFile.filename}`;
      }
   }


    const video = await Video.create(videoData);

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video)
      return res.status(404).json({ message: "Video not found" });

    if (video.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    // strip domain helper
    const stripDomain = (url) => {
      if (!url) return url;
      return url.replace(/^https?:\/\/[^/]+/, "");
    };

    // update text fields only
    video.title = req.body.title ?? video.title;
    video.description = req.body.description ?? video.description;
    video.category = req.body.category ?? video.category;
    video.source = req.body.source ?? video.source;
    video.tags = req.body.tags ?? video.tags;
    video.status = req.body.status ?? video.status;

    video.videoUrl = stripDomain(req.body.videoUrl);
    video.thumbnailUrl = stripDomain(req.body.thumbnailUrl);

    if (req.body.status === "published" && !video.publishedAt) {
      video.publishedAt = new Date();
    }

    await video.save();

    res.json(video);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// const getPublishedVideos = async(req, res) => {
//  try{
//     const videos = await Video.find({status:"published"})
//     .populate("category","name")
//     .sort({publishedAt: -1})

//     res.json(videos)
//  }catch(error){
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//  }
// // res.json("Fetching all Videos")
// }
const getVideos = async(req, res) => {
 try{
    const videos = await Video.find()
    .populate("category","name")
    .sort({publishedAt: -1})

    res.json(videos)
 }catch(error){
    console.log(error);
    res.status(500).json({ message: "Server error" });
 }
// res.json("Fetching all Videos")
}

const getVideoById = async(req, res) => {
 try{
   const video = await Video.findById(req.params.id)

   if(!video) 
      return res.status(404).json({message: "Video not found"})
   video.views += 1
   await video.save()

   res.json(video)
 }catch(error){
    console.log(error);
    res.status(500).json({ message: "Server error" });
 }
// res.json("Fetching Video")
}

const deleteVideo = async(req, res) => {
 try{
    const video = await Video.findById(req.params.id)

    if(!video) 
      return res.status(404).json({message: "Video not found"})

   if(video.createdBy.toString() !== req.user.id)
      return res.status(403).json({message: "Not authorized"})

   await video.deleteOne()

   res.json({message: "Video deleted successfully"})
 }catch(error){
    console.log(error);
    res.status(500).json({ message: "Server error" });
 }
// res.json("Video deleted")
}

const deleteCollection = ()=>{
   
}

export {createVideo, updateVideo, getVideos, getVideoById, deleteVideo};