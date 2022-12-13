const Joi=require('joi');
const { User, RefreshTokens } = require('../../models');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const bcrypt=require('bcrypt');
const { use } = require('../../routes');
const JwtService=require('../../services/JwtService')
const {REFRESH_SECRET}=require('../../config/config');

const registerController={
    async register(req,res,next){
        const registerSchema=Joi.object({
            name:Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password: Joi.ref('password')
        })

        //checking if there is any validation error
        const {error}=registerSchema.validate(req.body)


        if(error)
            return next(error);

        // Checking if there is the user already exists in database
        
        try{
            const exist=await User.exists({email: req.body.email})
            if(exist){
                return next(CustomErrorHandler.alreadyExists("This email already exits"))
            }
        }
        catch(err){
            // return 0;
            return next(error);
        }

        const {name,email,password}= req.body
        
        const hashedPassword=await bcrypt.hash(password,10);

        const user=new User({name,email,password: hashedPassword})

        let accessToken,refreshToken,resultRefreshToken;
        try{
            const result =await user.save();
            accessToken=JwtService.sign({_id:result._id ,role: result.role});
            refreshToken=JwtService.sign({_id:result._id ,role: result.role},'1y', REFRESH_SECRET)
            const refreshTokens= new RefreshTokens({token: refreshToken})
            resultRefreshToken = await refreshTokens.save();
        }
        catch(err){
            return next(err);
        }

        return res.json({'access_token': `${accessToken}`,
                        'refresh_token': `${resultRefreshToken.token}`,
                        'message': "User Created successfully"});
    }
}


module.exports= registerController;