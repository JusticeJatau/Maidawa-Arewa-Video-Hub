// middlewares/uploadProfile.js
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3, B2_BUCKET_NAME } from "../config/s3.js";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, must be an image"), false);
  }
};

const storage = multerS3({
  s3: s3,
  bucket: B2_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `profile/${uniqueName}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const uploadProfile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for avatars
});

export { uploadProfile };