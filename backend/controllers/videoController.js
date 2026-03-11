import Video from "../models/Video.js";
import Reaction from "../models/Reaction.js";
import mongoose from "mongoose";
import { s3, B2_BUCKET_NAME, B2_PUBLIC_URL } from "../config/s3.js";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateSignedUrl = async (key, expiresIn = 3600) => {
  try {
    if (!key) return null;
    
    const command = new GetObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key,
    });
    
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};


const createVideo = async (req, res) => {
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
      // thumbnailUrl from frontend will be used as-is
    } else if (source === "upload") {
      if (!req.files || !req.files.video) {
        return res.status(400).json({ message: "Video file is required" });
      }

      // Get the S3 key from the uploaded file
      const videoFile = req.files.video[0];
      videoData.videoUrl = videoFile.key; // Store just the path (includes folder structure)
      console.log("Video Url: ", videoFile.key)

      if (req.files.thumbnail) {
        const thumbFile = req.files.thumbnail[0];
        videoData.thumbnailUrl = thumbFile.key; // Store just the path
        console.log("Thumbnail Url: ", thumbFile.key)
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

    // update text fields only
    video.title = req.body.title ?? video.title;
    video.description = req.body.description ?? video.description;
    video.category = req.body.category ?? video.category;
    video.source = req.body.source ?? video.source;
    video.tags = req.body.tags ?? video.tags;
    video.status = req.body.status ?? video.status;

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

const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;

    const filter = { status: "published" }; // only published videos

    if (category && category !== 'All') filter.category = category;
    if (search && search.trim() !== '') {
      filter.title = { $regex: search, $options: 'i' };
    }

    const videos = await Video.find(filter)
      .populate("category", "name")
      .sort({ publishedAt: -1, _id: -1 }) // stable sort
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Add full URLs for uploaded videos
    const videosWithUrls = await Promise.all(
      videos.map(async (video) => {
        const videoObj = video.toObject();
        
        // For uploaded videos, prepend B2 URL
        if (video.source === 'upload') {
          if (video.videoUrl) {
            videoObj.videoUrl = video.videoUrl;
          }
          if (video.thumbnailUrl) {
            videoObj.thumbnailUrl = await generateSignedUrl(video.thumbnailUrl);
          }
        }
        // For YouTube videos, keep as-is
        console.log(videoObj)
        return videoObj;
      })
    );

    const total = await Video.countDocuments(filter);
    const hasNextPage = page * Number(limit) < total;

    res.json({ data: videosWithUrls, hasNextPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId)
      .populate("category", "name");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await Video.findByIdAndUpdate(videoId, {
      $inc: { views: 1 }
    });

    const userId = req.user?.id;
    // Aggregate reactions in ONE query
    const reactionStats = await Reaction.aggregate([
      { $match: { videoId: video._id } },
      {
        $facet: {
          likes: [
            { $match: { type: "like" } },
            { $count: "count" }
          ],
          dislikes: [
            { $match: { type: "dislike" } },
            { $count: "count" }
          ],
          ...(userId
        ? {
            userReaction: [
              { $match: { userId: new mongoose.Types.ObjectId(userId) } },
              { $project: { type: 1, _id: 0 } },
            ],
          }
          : {}),
        }
      }
    ]);

    const likes = reactionStats[0].likes[0]?.count || 0;
    const dislikes = reactionStats[0].dislikes[0]?.count || 0;
    const userReaction = reactionStats[0].userReaction?.[0]?.type || null;

    // Prepare video object with full URLs
    const videoObj = video.toObject();
    
    // Add full URLs for uploaded videos
    if (video.source === 'upload') {
      if (video.videoUrl) {
        videoObj.videoUrl = await generateSignedUrl(video.videoUrl);
      }
      if (video.thumbnailUrl) {
        videoObj.thumbnailUrl = await generateSignedUrl(video.thumbnailUrl);
      }
    }

    res.json({
      ...videoObj,
      likes,
      dislikes,
      userReaction
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteVideo = async(req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) 
      return res.status(404).json({ message: "Video not found" });

    if (video.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const deletionResults = {
      b2Success: [],
      b2Failed: []
    };

    // Delete files from B2 if source is upload
    if (video.source === 'upload') {
      const deletePromises = [];

      // Helper function to extract key from URL
      const extractKeyFromUrl = (url) => {
        if (!url) return null;
        try {
          const urlObj = new URL(url);
          // Remove leading slash from pathname
          return urlObj.pathname.startsWith('/') ? urlObj.pathname.substring(1) : urlObj.pathname;
        } catch (error) {
          console.error('Error parsing URL:', error);
          return null;
        }
      };

      // Delete video file
      if (video.videoUrl) {
        const videoKey = extractKeyFromUrl(video.videoUrl);
        if (videoKey) {
          deletePromises.push(
            s3.send(new DeleteObjectCommand({
              Bucket: B2_BUCKET_NAME,
              Key: videoKey
            })).then(() => {
              deletionResults.b2Success.push(`video: ${videoKey}`);
            }).catch(err => {
              console.error(`Failed to delete video file ${videoKey}:`, err);
              deletionResults.b2Failed.push(`video: ${videoKey}`);
            })
          );
        }
      }

      // Delete thumbnail file
      if (video.thumbnailUrl) {
        const thumbnailKey = extractKeyFromUrl(video.thumbnailUrl);
        if (thumbnailKey) {
          deletePromises.push(
            s3.send(new DeleteObjectCommand({
              Bucket: B2_BUCKET_NAME,
              Key: thumbnailKey
            })).then(() => {
              deletionResults.b2Success.push(`thumbnail: ${thumbnailKey}`);
            }).catch(err => {
              console.error(`Failed to delete thumbnail file ${thumbnailKey}:`, err);
              deletionResults.b2Failed.push(`thumbnail: ${thumbnailKey}`);
            })
          );
        }
      }

      // Wait for all delete operations to complete
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    }

    // Delete the video document from database
    await video.deleteOne();
    
    res.json({ 
      message: "Video deleted successfully",
      details: {
        databaseDeleted: true,
        b2Deletions: deletionResults
      }
    });
    
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCollection = ()=>{
   
}

export {createVideo, updateVideo, getVideos, getVideoById, deleteVideo};