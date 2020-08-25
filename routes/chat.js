const passport = require('passport')
const express = require('express');
const router = express.Router()

const ChatCont = require('../controllers/chat')
const AuthCont = require('../controllers/auth')

router.get('/getchat/:userId',AuthCont.verifyToken,ChatCont.getchat())
router.get('/lastchat/:userId',AuthCont.verifyToken,ChatCont.lastchat())
router.get('/hasRead/:msgId',AuthCont.verifyToken,ChatCont.hasRead())

module.exports = router