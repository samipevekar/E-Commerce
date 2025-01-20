import express from 'express'
import { addToCart, deleteFromCart, fetchCartByUser, updateCart } from '../controller/Cart.js'

const router = express.Router()


router.post('/', addToCart)
router.get('/', fetchCartByUser)
router.delete('/:id', deleteFromCart)
router.patch('/:id', updateCart)

export default router

