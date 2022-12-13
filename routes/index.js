const express=require('express');
const router=express.Router();
const {registerController,loginController, userController, refreshController, productController}=require('../controllers/index');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');


router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.get('/me',auth,userController.me);
router.post('/refresh',refreshController.refresh);
router.post('/logout',auth,loginController.logout);
router.post('/product/cart-items',productController.getProducts);
router.post('/product',[auth,admin],productController.store);
router.put('/product/:id',[auth,admin],productController.update);
router.delete('/product/:id',[auth,admin],productController.destroy);
router.get('/product',productController.getAllProducts);
router.get('/product/:id',productController.getSingleProduct);

module.exports=router