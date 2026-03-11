// middlewares/uploadVideo.js
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3, B2_BUCKET_NAME } from "../config/s3.js";

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "video" &&
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } 
  else if (
    file.fieldname === "thumbnail" &&
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } 
  else {
    cb(new Error("Invalid file type"), false);
  }
};

// Configure multer-s3 for Backblaze B2
const storage = multerS3({
  s3: s3,
  bucket: B2_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const folder = file.fieldname === "video" ? "videos" : "thumbnails";
    const fileName = `${folder}/${uniqueName}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

export { uploadVideo };