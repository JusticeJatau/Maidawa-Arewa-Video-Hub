// models/Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      // trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // can reference a Category model if needed
      ref: "Category",
      required: true,
    },
    source: {
      type: String,
      enum: ["youtube", "upload"],
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      // required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

videoSchema.index({ status: 1, publishedAt: -1 });
videoSchema.index({ category: 1 });
videoSchema.index({ title: 'text' });

const Video = mongoose.model("Video", videoSchema);
export default Video;
