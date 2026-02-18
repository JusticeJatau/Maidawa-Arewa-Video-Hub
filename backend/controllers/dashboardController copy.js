import Video from "../models/Video.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const getDashboardStats = async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();

    const totalViewsAgg = await Video.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: { $ifNull: ["$views", 0] } }
        }
      }
    ]);

    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    const recentVideosRaw = await Video.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title thumbnailUrl views duration createdAt");

    const recentVideos = recentVideosRaw.map(video => ({
        id: video._id,
        title: video.title,
        thumbnail: video.thumbnailUrl,
        views: video.views,
        duration: video.duration || "--:--",
        uploaded: dayjs(video.createdAt).fromNow()
    }));


    res.status(200).json({
        totalVideos,
        totalUsers,
        totalCategories,
        totalViews,
        recentVideos
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


export {getDashboardStats}