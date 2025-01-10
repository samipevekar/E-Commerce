import express from 'express'
import { fetchUserById, updateUser } from '../controller/User.js'

const router = express.Router()

router.get('/:id', fetchUserById)
router.patch('/:id', updateUser)

export default router

