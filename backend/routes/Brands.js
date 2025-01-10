import express from 'express'
import { createBrand, fetchAllBrands } from '../controller/Brand.js'

const router = express.Router()


router.get('/', fetchAllBrands)
router.post('/', createBrand)

export default router

