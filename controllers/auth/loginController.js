const Joi=require('joi');
const { User , RefreshTokens} = require('../../models');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const bcrypt=require('bcrypt');
const JwtService = require('../../services/JwtService');
const {REFRESH_SECRET}=require('../../config/config');

const loginController={

    async login(req,res,next){
        const loginSchema=Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        })
        
        //checking if there is any validation error
        const {error}=loginSchema.validate(req.body);
        if(error)
            return next(error);
        
        // validate whether the password and email are correct
        try{
            const user=await User.findOne({email: req.body.email});

            if(!user){
                return next(CustomErrorHandler.wrongCredentials("Email is not registered with us"))
            }

            // if user exists the compare the input password with the database password
            const match=await bcrypt.compare(req.body.password,user.password)
            if(!match){
                return next(CustomErrorHandler.wrongCredentials("Password is invalid"));
            }

            const accessToken=JwtService.sign({_id:user._id ,role: user.role});
            refreshToken=JwtService.sign({_id:user._id ,role: user.role},'1y', REFRESH_SECRET)
            const refreshTokens= new RefreshTokens({token: refreshToken})
            resultRefreshToken = await refreshTokens.save();


            return res.json({
                'access_token': `${accessToken}`,
                'refresh_token': `${resultRefreshToken.token}`,
                'message': "User LoggedIn Successfully"
            })
        }
        catch(error){
            return next(error);
        }
    },
    
    async logout(req,res,next){
        const logoutSchema=Joi.object({
            refresh_token: Joi.string().required(),
        })
        const {error} = logoutSchema.validate(req.body);
        if(error)
            return next(error);

        try{
            const result=await RefreshTokens.deleteOne({token: req.body.refresh_token});
        }
        catch(err){
            return next(new Error("Something Went wrong"));
        }
        
        return res.json({status: 1 , message: "Logged Out Successfully"});
    }
    
}

module.exports=loginController