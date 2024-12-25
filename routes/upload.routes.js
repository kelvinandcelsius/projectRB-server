import express from 'express'
const router = express.Router()

import { imageRoute } from '../controllers/upload.controllers.js'
import { uploadPolicy } from '../controllers/policy.controllers.js'
import { createCompany } from '../controllers/company.controllers.js'
import uploader from './../middlewares/uploader.middleware.js'
import { isAuthenticated } from './../middlewares/verifyToken.middleware.js'

router.post('/image', uploader.single('imageData'), imageRoute)
router.post('/policy', isAuthenticated, uploadPolicy)
router.post('/company-logo', uploader.single('logo'), createCompany)

export default router