import express from 'express'
import { createCategory, fetchAllCategory } from '../controller/Category.js'

const router = express.Router()


router.get('/', fetchAllCategory)
router.post('/', createCategory)

export default router

