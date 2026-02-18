import Video from "../models/Video.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);

const getDashboardStats = async (req, res) => {
  try {

    const now = new Date();
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(now.getMonth() - 6);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const [
      totalVideos,
      totalUsers,
      totalCategories,
      totalViewsAgg,
      recentVideosRaw,
      monthlyStats,
      newUsers7d
    ] = await Promise.all([

      Video.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),

      // total views
      Video.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: { $ifNull: ["$views", 0] } }
          }
        }
      ]),

      // recent videos
      Video.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title views thumbnailUrl duration createdAt"),

      // monthly uploads & views (current year)
        Video.aggregate([
        {
            $match: {
            createdAt: {
                $gte: new Date(`${now.getFullYear()}-01-01`),
                $lt: new Date(`${now.getFullYear() + 1}-01-01`)
            }
            }
        },
        {
            $group: {
            _id: { $month: "$createdAt" },
            videos: { $sum: 1 },
            views: { $sum: { $ifNull: ["$views", 0] } }
            }
        }
        ]),

    ]);

    const totalViews = totalViewsAgg[0]?.totalViews || 0;

    // format recent videos
    const recentVideos = recentVideosRaw.map(video => ({
      id: video._id,
      title: video.title,
      thumbnail: video.thumbnailUrl,
      views: video.views ?? 0,
      duration: video.duration || "--:--",
      uploaded: dayjs(video.createdAt).fromNow()
    }));

    // month names
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // build last 7 months data
    const activityData = monthNames.map((month, index) => {
    const stat = monthlyStats.find(m => m._id === index + 1);

    return {
        month,
        videos: stat?.videos || 0,
        views: stat?.views || 0
    };
    });


    // engagement rate (example logic)
    const engagementRate = totalViews
      ? ((totalViews / totalVideos) * 100).toFixed(1)
      : 0;

    // avg watch time placeholder
    const avgWatchTime = "18m 45s"; // requires watch-time tracking

    res.status(200).json({
      totals: {
        totalVideos,
        totalUsers,
        totalCategories,
        totalViews
      },
      recentVideos,
      activityData,
      platformStats: {
        avgWatchTime,
        engagementRate: `${engagementRate}%`,
        newUsers7d
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

export { getDashboardStats };
