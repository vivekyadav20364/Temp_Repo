const express=require('express');
const morgan=require('morgan');
const colors=require('colors');
const dotenv=require('dotenv');
const connectdb = require('./config/db');
const cors=require('cors');


//dotenv config
dotenv.config();

//mongodb connection
connectdb();

//rest object
const app=express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use("/api/v1/user",require("./routes/userRoutes"));
     
//listen
const port=process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`server is running at ${process.env.PORT}`
    .bgCyan.white
    );
})