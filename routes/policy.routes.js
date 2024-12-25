import express from 'express'
const router = express.Router()
import { isAuthenticated } from './../middlewares/verifyToken.middleware.js'
import { analyzePolicy, createPolicy } from '../controllers/policy.controllers.js'

router.post('/analyze-policy/:key', analyzePolicy)
router.post('/create-policy', isAuthenticated, createPolicy)

export default router