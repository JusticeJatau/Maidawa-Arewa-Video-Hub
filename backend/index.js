import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import videoRoutes from './routes/videoRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import reactionRoutes from './routes/reactionRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import otpRoutes from './routes/otpRoutes.js'
import { swaggerDocs } from './config/swagger.js'

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cors())
const router = express.Router()

app.get("/config.json", (req, res) => {
  res.json({
    BACKEND_URL: "https://ma-video-hub-backend.onrender.com",
    VIDEO_BASE_URL: "https://ma-video-hub-backend.onrender.com/uploads",
    APP_VERSION: "1.0.0"
  });
});

//gives acces to video in the upload folder
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/react', reactionRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/otp', otpRoutes);

swaggerDocs(app);

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})