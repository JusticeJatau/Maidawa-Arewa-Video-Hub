import { addComment, getVideoComments } from "../controllers/commentController.js";
import { auth } from "../middleware/authMiddleware.js";
import express from "express"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Video comments routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *         videoId:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *         userId:
 *           type: string
 *           example: 6984613caae810391dff7bf2
 *         content:
 *           type: string
 *           example: This video is amazing!
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-07T22:24:42.409Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-02-07T22:25:42.409Z
 */

// -------------------------------------
// Protected route: add comment
// -------------------------------------

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a comment to a video
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - content
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: ID of the video
 *                 example: 6984613caae810391dff7bf1
 *               content:
 *                 type: string
 *                 description: Comment text
 *                 example: This video is amazing!
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.post("/", auth, addComment);

// -------------------------------------
// Public route: get comments for a video
// -------------------------------------

/**
 * @swagger
 * /api/comments/{videoId}:
 *   get:
 *     summary: Get all comments for a specific video
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: ID of the video
 *         schema:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *     responses:
 *       200:
 *         description: List of comments for the video
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Video not found
 */
router.get("/:videoId", getVideoComments);


export default router