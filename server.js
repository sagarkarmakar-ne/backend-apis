const express=require('express');
const mongoose=require('mongoose')
const dbConnection = require('./db')
const app=express();
const {port,db_url}=require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const routes=require('./routes/index');
const path = require('path');

dbConnection()

// app.use(cors());
global.appRoot=path.resolve(__dirname);

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use('/api',routes);
app.use('/uploads',express.static('uploads'))

app.use(errorHandler);
app.listen(port,()=>{console.log(`Listening on ${port}`)});