const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const multer = require('multer')
const session = require('express-session')
const passport = require('passport')
// const cookieSession = require('cookie-session')
const cors = require('cors')
require('dotenv').config()
require('./helpers/passport-setup')

// ROUTERS
const Auth = require('./routes/auth')
const UserRoute = require('./routes/user')
const Chatjs = require('./controllers/chat')
const AuthCont = require('./controllers/auth')
const ChatRoute = require('./routes/chat')

//////

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
// Chatjs.chatemit(io)
app.use(Chatjs.chatemit(io))
// io.on('connection',socket => {
//     console.log('New User')
//     socket.emit('receive msg','Hello World')
//     socket.on('send msg',msg => {
//         socket.broadcast.emit('receive msg',msg)
//     })
// })

exports.server = server

/// Multer Config
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'images')
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var uploads = multer({
    storage: storage
})
/////


// MiddleWares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(uploads.single('profilepic'))
app.use(session({secret: process.env.SESSION_SECRET,resave: false, saveUninitialized: false}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(cookieSession({
//     name: 'project-session',
//     keys: ['key1', 'key2']
//   }))
app.use(cors())
///////////////////

/// API ROUTES

app.use('/api',Auth)
app.use('/api',UserRoute)
app.use('/api',ChatRoute)
/////


const port = process.env.PORT || 3000

mongoose.set('useFindAndModify', false);
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => server.listen(port,()=>{
        console.log('Server running at 3000\nDB connected successfully')
    }))
    .catch(err => console.log('DB CONNECTION FAILED\n',err))