const express = require("express");
const app = express();
const morgan = require('morgan');
const bodyParser =require('body-parser');
const mongoose = require('mongoose');

const productRouter = require('./api/route/product');
const orderRouter = require('./api/route/order');
const userRouter = require('./api/route/user');

mongoose.connect(`mongodb+srv://ut:qwerty1234@cluster0-xmjfz.mongodb.net/test?retryWrites=true&w=majority`)
mongoose.Promise=global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req, res, next){

    req.body = //sdffsdfsdf

next()
})


app.use((req,res,next) => {
    res.header("Allow-Control-Allow-origin","*");
    res.header(
        "Acces-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods' , 'PUT,POST,DELETE,PATCH')
        return res.status(200).json({});
    }
    next();
}); 



app.use('/order', orderRouter );
app.use('/product' ,productRouter); 
app.use('/user', userRouter );


app.use((req,res,next) =>{
    const error = new Error('not found');
    error.status = 404;
    next(error);
})
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })
})
module.exports = app;
