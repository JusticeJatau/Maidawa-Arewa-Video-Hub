import { createCategory, getCategory, getCategories } from "../controllers/categoryController.js";
import { auth } from "../middleware/authMiddleware.js";
import express from "express"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Video category management routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *         name:
 *           type: string
 *           example: Education
 *         description:
 *           type: string
 *           example: Videos related to educational content
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
// Protected route: create category
// -------------------------------------

/**
 * @swagger
 * /api/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Education
 *               description:
 *                 type: string
 *                 example: Videos related to educational content
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized
 */
router.post("/create", auth, createCategory);

// -------------------------------------
// Public route: get all categories
// -------------------------------------

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/categories", getCategories);

// -------------------------------------
// Public route: get single category
// -------------------------------------

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *           example: 6984613caae810391dff7bf1
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
router.get("/categories/:id", getCategory);

export default router;