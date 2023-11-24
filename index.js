const mongoose = require('mongoose')
const user = require('./controllers/userController')
mongoose.connect('mongodb://127.0.0.1:27017/YKENZZ')
.then(()=>{
    console.log("Mongo DB is connected");
}).catch(()=>{
    console.log("Mongo DB is failed");
})


const express = require('express')
const app= express();

const bodyParser = require('body-parser')
const cookieparser = require('cookie-parser')

const multer = require('multer')


const nocache = require('nocache')
const config= require('./config/config')

const {v4:uuidv4}=require('uuid')
const session = require('express-session')
app.use(session({
    secret : config.password,
    saveUninitialized : true,
    resave : false
}))



app.use(express.static('public'))

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine','ejs')
app.set('views','./views')
app.use(nocache())
app.use(cookieparser())
const PORT =process.env.PORT||3000

//for users
const userRouter = require('./router/userRouter')
app.use('/',userRouter)

// for admin
const adminRouter = require('./router/adminRouter');
const cookieParser = require('cookie-parser');
app.use('/admin',adminRouter)


app.listen(PORT,()=>{
    console.log("Sever is Running"); 
})

