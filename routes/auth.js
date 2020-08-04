const passport = require('passport')
const express = require('express');
const router = express.Router()
const isLoggedIn = (req,res,next)=>{
    console.log(req.session.passport)
    if(req.session.passport){
        next()
    }else{
        res.sendStatus(401)
    }
}

const AuthCont = require('../controllers/auth')
router.get('/',(req,res) => {res.send('Hello World')})
router.get('/failed',(req,res)=> {res.send('Login Failed')})
router.get('/success',isLoggedIn,(req,res)=> {res.send('Login Success')})
router.post("/signup",AuthCont.signup)
router.post("/profilepic/:userId",AuthCont.profilePic)
router.post("/signin",AuthCont.signin);
router.get("/signout",AuthCont.signout);
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));


router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.

    res.redirect('/api/success');
  });
router.get('/logout',(req,res)=> {
    req.session = null
    req.logout()
    console.log(req.session,'\n',req.user)
    res.redirect('/api/')
})

module.exports = router