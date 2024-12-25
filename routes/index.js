import express from 'express'
import authRoutes from './auth.routes.js'
import uploadRoutes from './upload.routes.js'
import userRoutes from './user.routes.js'
import companyRoutes from './company.routes.js'
import policyRoutes from './policy.routes.js'
import bidRoutes from './bid.routes.js'

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/upload", uploadRoutes)
router.use("/users", userRoutes)
router.use("/companies", companyRoutes)
router.use("/policies", policyRoutes)
router.use("/bids", bidRoutes)

export default router
