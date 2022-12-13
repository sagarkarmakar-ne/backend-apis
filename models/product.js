const mongoose=require('mongoose')
const Schema=mongoose.Schema;
const {APP_URL} = require('../config/config')

const productSchema=new Schema({
    name:{type: String, required: true},
    price:{type: String, required: true},
    image:{type: String, required: true, get: (image) =>{
        return `${APP_URL}/${image}`
    }},
    size:{type: String, required: true}
},{timestamps: true, toJSON: {getters : true}});

module.exports=mongoose.model('Product', productSchema, 'products')