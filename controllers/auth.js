const fs = require('fs')
const jwt = require('jsonwebtoken')

const Users = require('../models/users')

exports.UserDetails = (req,res)=>{
    if(req.user){
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name
        })
    }
}

exports.signup = async (req,res) => {
    let existUser = await Users.findOne({email: req.body.email})
    if(existUser){
        return res.json({error:true,message: "User with that email already exists"})
    }
    else{
        const user = new Users(req.body)
        user.save().then(result => {return res.status(200).json({
            success: true,
            message: "You have successfully registered"
        })})
        .catch(err => {
        return res.json({error:true,message: "User signup failed "})
    })
    }

}

exports.signin = (req,res) => {
    const email = req.body.email
    const password = req.body.password
    Users.findOne({email,password}).select('-password -profilePic')
    .then(result => {
        let token = jwt.sign({_id:result._id,name:result.name},'keygoeshere')
        return res.status(200).json({
            token: token,
            expiresIn: 3600
        })
    }).catch(err => {return res.json({error: true,message: "Incorrect email or password"})})
}

exports.profilePic = (req,res) => {
    const userId = req.params.userId
    var imgdata = fs.readFileSync(req.file.path)
    var encoded_img = imgdata.toString('base64')

    var profilepic = {
        data: new Buffer(encoded_img,'base64'),
        contentType: req.file.mimetype
    }

    fs.unlinkSync(req.file.path)

    Users.findByIdAndUpdate(userId,{profilePic: profilepic},(err,result) => {
        if(err){
            return res.json({error: true, message: "Profile picture could not be uploaded"})
        }
        res.set('Content-Type',profilepic.contentType)
        return res.send(profilepic.data)
    })
}

exports.signout = (req,res) => {
    decodedtoken = null
    return res.status(200).json({success: true,message: "Successfully logged out"})
}

exports.verifyToken = (req,res,next) => {
    try {
        let token = req.headers.authorization.split(" ")[1]
        const decodedtoken = jwt.verify(token,'keygoeshere')
        req.user = {_id: decodedtoken._id,name: decodedtoken.name}
        next()
    } catch (error) {
        res.status(401).json({error:true,message: "Authentication failed"})
    }
}

