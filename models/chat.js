const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const ChatSchema = new mongoose.Schema({

    personA: {
        type: ObjectId,
        ref: 'User'
    },
    personB: {
        type: ObjectId,
        ref: 'User'
    },
    chats: [{
        sender: {
            type: ObjectId,
            ref: 'User'
        },
        receiver: {
            type: ObjectId,
            ref: 'User'
        },
        message: String,
        hasRead: {
            type: Boolean,
            default:false
        }
    }]
})

module.exports = mongoose.model('Chat',ChatSchema)