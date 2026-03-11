// config/s3.js (make sure this is set up correctly)
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3 = new S3Client({
    endpoint: `https://s3.${process.env.B2_REGION}.backblazeb2.com`,
    region: process.env.B2_REGION,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
    },
    forcePathStyle: true, // Important for Backblaze B2
});

export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
export const B2_PUBLIC_URL = process.env.B2_PUBLIC_URL || `https://${B2_BUCKET_NAME}.s3.${process.env.B2_REGION}.backblazeb2.com`;