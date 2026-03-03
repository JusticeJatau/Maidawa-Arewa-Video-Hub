import { reactToVideo } from "../controllers/reactionController.js";
import { auth } from "../middleware/authMiddleware.js";
import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /api/react/{id}:
 *   post:
 *     summary: React to a video (like, dislike, etc.)
 *     tags: [Reactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: ID of the video to react to
 *        schema:
 *          type: string
 *          example: 6984613caae810391dff7bf1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reaction
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of reaction
 *                 enum: [like, dislike]
 *                 example: like
 *     responses:
 *       200:
 *         description: Reaction saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reaction added successfully
 *                 videoId:
 *                   type: string
 *                   example: 6984613caae810391dff7bf1
 *                 reaction:
 *                   type: string
 *                   example: like
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Video not found
 */
router.post('/:id', auth, reactToVideo);


export default router;