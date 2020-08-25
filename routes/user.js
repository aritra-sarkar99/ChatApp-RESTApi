const passport = require('passport')
const express = require('express');
const router = express.Router()

const UserCont = require('../controllers/user')
const AuthCont = require('../controllers/auth')
router.get('/getuserlist',AuthCont.verifyToken,UserCont.getUserList)

module.exports = router