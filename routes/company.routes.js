import express from 'express'
const router = express.Router()
import { createCompany, getAllCompanies, addSelectedCompanies } from '../controllers/company.controllers.js'

router.post('/create-company', createCompany)
router.get('/get-all-companies', getAllCompanies)
router.post('/add-selected-companies', addSelectedCompanies)

export default router