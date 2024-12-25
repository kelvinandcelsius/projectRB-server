import express from 'express'
const router = express.Router()
import { signUp, logIn, verify } from '../controllers/auth.controllers.js'
import { isAuthenticated } from '../middlewares/verifyToken.middleware.js'

router.post('/signup', signUp)
router.post('/login', logIn)
router.get('/verify', isAuthenticated, verify)

export default router