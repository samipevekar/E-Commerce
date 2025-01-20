import express from 'express'
import { checkAuth, createUser, loginUser } from '../controller/Auth.js'
import passport from 'passport'

const router = express.Router()
router.post('/signup', createUser)
router.post('/login', passport.authenticate('local'), loginUser)
router.get('/check',passport.authenticate('jwt'), checkAuth);

export default router;
