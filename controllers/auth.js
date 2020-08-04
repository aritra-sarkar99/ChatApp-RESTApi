const fs = require('fs')

const Users = require('../models/users')

exports.signup = (req,res) => {
    const user = new Users(req.body)
    user.save().then(result => {res.status(200).json(result)})
    .catch(err => {
        res.json({error:true,message: "User signup failed "})
    })

}

exports.signin = (req,res) => {
    // const email = req.body.email
    // const password = req.body.password
    // Users.findOne({email,password}).select('-password')
    // .then(result => {
    //     req.session.profile = result
    //     res.status(200).json(result)
    // }).catch(err => {res.json({error: true,message: "Failed to sign in"})})
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
    // if(req.session.profile){
    //     req.session.profile = undefined
    //     res.status(200).json({success: true,message: "Successfully logged out"})
    // }
    // else{
    //     res.json({message: "You are not logged in"})
    // }
}