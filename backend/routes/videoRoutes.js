import express from "express"
import { createVideo, updateVideo, getVideos, getVideoById, deleteVideo } from "../controllers/videoController.js"
import { auth } from "../middleware/authMiddleware.js";
import { uploadVideo } from "../middleware/uploadVideo.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *         title:
 *           type: string
 *           example: My First Video
 *         description:
 *           type: string
 *           example: This is a sample video description.
 *         url:
 *           type: string
 *           example: https://example.com/videos/123
 *         published:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-05T09:22:04.117Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-07T22:24:42.409Z
 */

// -------------------------------------
// Public routes
// -------------------------------------

/**
 * @swagger
 * /api/videos/videos:
 *   get:
 *     summary: Get all published videos
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: List of published videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 */
router.get("/videos", getVideos);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Video ID
 *         schema:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *     responses:
 *       200:
 *         description: Video found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       404:
 *         description: Video not found
 */
router.get("/:id", getVideoById);

// -------------------------------------
// Protected routes
// -------------------------------------

/**
 * @swagger
 * /api/videos/create:
 *   post:
 *     summary: Create a new video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Video
 *               description:
 *                 type: string
 *                 example: This is a sample video description.
 *               url:
 *                 type: string
 *                 example: https://example.com/videos/123
 *               published:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 */
router.post(
    "/create", 
    auth, 
    uploadVideo.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
        ]), 
    createVideo);

/**
 * @swagger
 * /api/videos/edit/{id}:
 *   put:
 *     summary: Update a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Video ID
 *         schema:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Video Title
 *               description:
 *                 type: string
 *                 example: Updated description.
 *               url:
 *                 type: string
 *                 example: https://example.com/videos/updated
 *               published:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.put("/edit/:id", auth, updateVideo);

/**
 * @swagger
 * /api/videos/delete/{id}:
 *   delete:
 *     summary: Delete a video
 *     tags: [Videos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Video ID
 *         schema:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.delete("/delete/:id", auth, deleteVideo);

export default router;