// const {server} = require('../app')
// const io = require('socket.io')(server)
// {
//     senderId: '5f2832697689fc44686bad7b',
//     receiverId: '5f2a5dab998a1c2ad834000d',
//     text: 'Hey Dad whatsup'
//   }
const Chats = require('../models/chat')

function chatemit(io){
    io.on('connection',socket => {

        // socket.emit('receive-msg','Hello World')
        socket.on('send msg',async msg => {
            //First check if chat exists
            try {
                let chats = await Chats.findOne({
                    $or: [{personA: msg.senderId,personB: msg.receiverId},
                        {personA: msg.receiverId,personB: msg.senderId}
                    ]
                })

                if(chats==null){
    
                    const chatbody = {
                        personA: msg.senderId,
                        personB: msg.receiverId,
                        chats: [{
                            sender: msg.senderId,
                            receiver: msg.receiverId,
                            message: msg.text
                        }]
                    }
                    result = await Chats.create(chatbody)
                    socket.emit('receive-msg',{
                        personA: result.personA,
                        personB:result.personB,
                        chats: result.chats[result.chats.length -1]
                    })
                    socket.broadcast.emit('receive-msg',{
                        personA: result.personA,
                        personB:result.personB,
                        chats: result.chats[result.chats.length -1]
                    }) //Select chat from Db and broadcast
                }
                else{
                    const chatbody = {
                        sender: msg.senderId,
                        receiver: msg.receiverId,
                        message: msg.text
                    }
                    chats.chats.push(chatbody)
                    Chats.findByIdAndUpdate(chats._id,chats,{new:true}).then(result => {
                        
                        socket.emit('receive-msg',{
                            personA: result.personA,
                            personB:result.personB,
                            chats: result.chats[result.chats.length -1]
                        })
                        socket.broadcast.emit('receive-msg',{
                            personA: result.personA,
                            personB:result.personB,
                            chats: result.chats[result.chats.length -1]
                        })
                    })
                    
                }
                // socket.broadcast.emit('receive-msg',msg)
            } catch (error) {
                console.log(error) //Handle Error
            }
            
        })
    })
    return function(req,res,next){
        next()
    }
}

function getchat(){
    return (req,res) => {
        const userId = req.params.userId
        const sentId = req.user._id

        Chats.findOne({
            $or: [{personA: userId,personB: sentId},
                {personA: sentId,personB: userId}
            ]
        }).then(result => {
            return res.status(200).json(result)
        }).catch(err => {
            return res.json({error:true,message: "Could not get chat history"})
        })
    }
}

function lastchat(){
    return (req,res) => {
        const userId = req.params.userId
        const sentId = req.user._id

        Chats.findOne({
            $or: [{personA: userId,personB: sentId},
                {personA: sentId,personB: userId}
            ]
        }).then(result => {
            const chats  = result.chats
            return res.status(200).json({
                personA: result.personA,
                personB: result.personB,
                chats: chats[chats.length-1]
            })
        }).catch(err => {
            return res.json({error:true,message: "Could not get last chat"})
        })
    }
}

function hasRead(){
    return (req,res) => {
        const msgId = req.params.msgId

        Chats.update({'chats._id':msgId},{
            $set:{'chats.$.hasRead':true}
        },{new:true}).then(data => {
            return res.status(200).json({success:true})
        }).catch(err => {return res.json({error:true})})

    }
}
module.exports = {chatemit,getchat,lastchat,hasRead}