import express from 'express'
import { createOrder, deleteOrder, fetchAllOrders, fetchOrderByUser, updateOrder } from '../controller/Order.js'

const router = express.Router()


router.post('/', createOrder)
router.get('/own', fetchOrderByUser)
router.delete('/:id', deleteOrder)
router.patch('/:id', updateOrder)
router.get('/', fetchAllOrders)

export default router

