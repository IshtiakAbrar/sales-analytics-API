//import dependencies
const express = require('express');
const app= new express();
const router = require('./src/Routes/api');
const bodyParser= require('body-parser');
const cookieParser =require('cookie-parser');
let multer = require('multer');
multer = multer();
const mongoose= require('mongoose');
const cors= require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');
const helmet= require('helmet');
const hpp= require('hpp');
const validator= require('validator');
const path =require('path')
//const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});


//use dependencies

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(mongoSanitize());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true}));
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(multer.array());
//validator.isEmail('foo@bar.com');


//request rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use(limiter);



//Database connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.4qocopg.mongodb.net/SalesAnalytics`)
    .then(()=>{
        console.log("Connected to MongoDB");
    })
    .catch((e)=>{
        console.log("Couldn't connect to MongoDB",e);
    })



  
app.use('/api/v1',router);



//wrong url handler
app.use("*", (req,res)=>{
    res.status(404).json({status:"failed",Data:"Not found!"})
});






module.exports = app;