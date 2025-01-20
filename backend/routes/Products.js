import express from 'express'
import { createProduct, fetchAllProducts, fetchProductById, getKey, paymentVerification, processPayment, updateProduct } from '../controller/Product.js'

const router = express.Router()


router.post('/', createProduct)
router.get('/', fetchAllProducts)
router.get('/:id', fetchProductById)
router.patch('/:id',updateProduct)
router.post('/payment/process',processPayment)
router.get('/payment/getkey',getKey)
router.post('/payment/verification',paymentVerification)



export default router

