// utils/b2Helpers.js
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, B2_BUCKET_NAME } from "../config/s3.js";

export const getSignedVideoUrl = async (key, expiresIn = 3600) => {
  try {
    // Your keys are already clean (no leading slash)
    const command = new GetObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key, // e.g., "videos/filename.mp4"
    });
    
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};