const passport = require('passport')
const express = require('express');
const router = express.Router()

const AuthCont = require('../controllers/auth')



router.get('/failed',(req,res)=> {res.status(400).json({error:true,message:"Google authentication failed"}) })
router.get('/success',(req,res)=>{res.json(req.session)})
router.get('/getuser',AuthCont.verifyToken,AuthCont.UserDetails)
router.post("/signup",AuthCont.signup)
router.post("/profilepic/:userId",AuthCont.profilePic)
router.post("/signin",AuthCont.signin);
router.get("/signout",AuthCont.signout);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.status(200).json(req.session.passport.user)
    console.log('PASSPORT:',req.session.passport.user)
    res.status(200).json(req.session.passport.user)
  });
// router.get('/logout',(req,res)=> {
//     req.session = null
//     req.logout()
//     console.log(req.session,'\n',req.user)
//     res.redirect('/api/')
// })

module.exports = router