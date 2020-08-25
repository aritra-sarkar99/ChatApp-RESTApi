const Users = require('../models/users')

exports.getUserList = (req,res) => {
    Users.find({_id: {$nin: req.user._id}},(err,result)=>{
        if(err){
            res.json({error:true,message:"Users not found"})
        }
        return res.status(200).json(result)
    })
}