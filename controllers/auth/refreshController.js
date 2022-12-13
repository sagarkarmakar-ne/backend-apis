const {RefreshTokens, User}=require('../../models/index');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const JwtService = require('../../services/JwtService');
const {REFRESH_SECRET}= require('../../config/config')
const Joi=require('joi')

const refreshController={
    async refresh(req,res,next) {
        const refreshSchema=Joi.object({
            refresh_token: Joi.string().required()
        })
        //checking if there is any validation error
        const {error}=refreshSchema.validate(req.body);
        if(error)
            return next(error);
        let refreshToken; 
        try{
           // Finding the refresh token in the database
           
            refreshToken=await RefreshTokens.findOne({token: req.body.refresh_token});

            if(!refreshToken){
                // Not found send the error that it is Invalid Refresh Token
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token 1"));
            }

            let userId;
            try{
                // Verify the token if the token is verified _id of the user will be returned
                const { _id ,role} = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            }
            catch(err){
                // Invalid Refresh Token
                return next(CustomErrorHandler.unAuthorized("Invalid Refresh Token 2"))
            }

            // With the retrieved id we fetch the details of that user which will used for creating
            //  new ACCESS_TOKEN and REFRESH_TOKEN
            
            const user=await User.findOne({_id: userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized("No User Found"));
            }

            let access_token=JwtService.sign({_id:user._id ,role: user.role});
            let new_refresh_token=JwtService.sign({_id:user._id ,role: user.role},'1y', REFRESH_SECRET)
            const refreshTokens= new RefreshTokens({token: new_refresh_token})

            resultRefreshToken = await refreshTokens.save();
             
            res.json({
                'access_token': `${access_token}`,
                'refresh_token': `${resultRefreshToken.token}`,
                'message': "New Tokens Generated"
            })   
        }
        catch(error){
            return next(error)
        }
        return 0;
    }
};

module.exports=refreshController;