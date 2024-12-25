import express from 'express'
const router = express.Router()
import { createBid } from '../controllers/bid.controllers.js'

router.post('/create-bid', createBid)

export default router