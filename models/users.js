const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    profilePic: {
        data: Buffer,
        contentType: String
    }

})

module.exports = mongoose.model('User',UserSchema)