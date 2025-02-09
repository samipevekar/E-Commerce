import express from 'express'
import { checkAuth, createUser, loginUser, logout, resetPasswordRequest, resetPassword, googleAuth } from '../controller/Auth.js'
import passport from 'passport'

const router = express.Router()
router.post('/signup', createUser)
router.post('/login', passport.authenticate('local'), loginUser)
router.get('/check',passport.authenticate('jwt'), checkAuth);
router.get('/logout', logout);
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)
router.post('/google', googleAuth)

export default router;
