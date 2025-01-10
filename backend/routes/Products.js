import express from 'express'
import { createProduct, fetchAllProducts, fetchProductById, updateProduct } from '../controller/Product.js'

const router = express.Router()


router.post('/', createProduct)
router.get('/', fetchAllProducts)
router.get('/:id', fetchProductById)
router.patch('/:id',updateProduct)

export default router

