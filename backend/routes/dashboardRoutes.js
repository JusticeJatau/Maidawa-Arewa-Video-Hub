import express from 'express'
import { auth } from '../middleware/authMiddleware.js'
import { allowRoles } from '../middleware/authMiddleware.js'
import { getDashboardStats } from '../controllers/dashboardController.js'

const dashboardRoutes = express.Router();

dashboardRoutes.get("/stats", auth, allowRoles("admin"), getDashboardStats);

export default dashboardRoutes