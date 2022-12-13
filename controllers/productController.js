const multer=require('multer');
const path=require('path');
const { nextTick } = require('process');
const CustomErrorHandler = require('../services/CustomErrorHandler');
const fs=require('fs');
const Joi = require('joi');
const product = require('../models/product');
const { Product } = require('../models');
const productSchema = require('../validation/productValidator');
const { id } = require('../validation/productValidator');


const storage=multer.diskStorage({
    destination: (req,file,cb) => { cb(null,'uploads/')},
    filename: (req,file,cb) => {
        const uniqueName= `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    }
})

const handleMultipartData = multer({
    storage,
    limits: {fileSize: 1000000 * 5}
}).single('image');

const productController={
    async store(req,res,next){
        // Handle multipart data
        let document;
        handleMultipartData(req,res,async (err) =>{

            if(err)
                return next(CustomErrorHandler.serverError("Server Error"));

            const {error}= productSchema.validate(req.body);
            const filePath = req.file.path
            if(error)
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });

            const {name,price,size} = req.body;

            try{
                document =await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                });
                res.json(document);
            }
            catch(err){
                return next(err);
            }  
        })
    },

    async update(req,res,next){
        // Handle multipart data
        let document;
        handleMultipartData(req,res,async (err) =>{

            if(err)
                return next(CustomErrorHandler.serverError("Server Error"));

            const {error}= productSchema.validate(req.body);
            let filePath;
            if(req.file)
                filePath = req.file.path
            if(error){
                if(filePath){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if (err) {
                            return next(
                                CustomErrorHandler.serverError(err.message)
                            );
                        }
                    });
                }
                
            }

            const {name,price,size} = req.body;

            try{
                document =await Product.findOneAndUpdate({_id: req.params.id},{
                    name,
                    price,
                    size,
                    ...(req.file && {image: filePath})
                },
                { new : true});
                res.json(document);
            }
            catch(err){
                return next(err);
            }  
        })
    },


    async destroy(req,res,next){
        try{

            let document=await Product.findOneAndRemove({_id : req.params.id});
            if(!document){
                return next(CustomErrorHandler.notFound("File Not Found"));
            }
            let filePath=document._doc.image;
            if(filePath){
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if (err) {
                        return next(
                            CustomErrorHandler.serverError(err.message)
                        );
                    }
                });
            }
            document.message = "Deleted Successfully";
            res.json(document);
        }
        catch(err){
            return next(CustomErrorHandler.notFound("Not Found"));
        }  
    },

    async getAllProducts(req,res,next){
        let document;
        try{
            document= await Product.find().select('-updatedAt -__v');
        }
        catch(err){
            return next(err);
        }
        return res.json(document);
    },

    async getSingleProduct(req,res,next){
        let document;
        try{
            document= await Product.findOne({_id: req.params.id}).select('-updatedAt -__v');
        }
        catch(err){
            return next(err);
        }
        return res.json(document);
    },

    async getProducts(req,res,next){
        let document;
        try{
            document= await Product.findOne({ _id: { $in: req.body.ids }}).select('-updatedAt -__v');
        }
        catch(err){
            return next(err);
        }
        return res.json(document);
    }
};
module.exports = productController;