const mongoose = require("mongoose");
const {db_url}=require('./config/config')

function connectDB(){

    mongoose.connect(db_url, {useUnifiedTopology: true , useNewUrlParser: true})

    const connection = mongoose.connection

    connection.on('connected' , ()=>{
        console.log('Mongo DB Connection Successfull')
    })

    connection.on('error' , ()=>{
        console.log('Mongo DB Connection Error')
    })
    // console.log(db_url)

}

// connectDB()

module.exports = connectDB
