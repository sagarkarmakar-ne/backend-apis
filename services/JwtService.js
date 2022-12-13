const {JWT_SECRET, REFRESH_SECRET}=require("../config/config");
const jwt=require('jsonwebtoken');

class JwtService{
    static sign(payload,expiry= '1200s',secret=JWT_SECRET){
        return jwt.sign(payload ,secret ,{expiresIn: expiry});
    }
    static verify(token,secret=JWT_SECRET){
        return jwt.verify(token ,secret);
    }
}

module.exports=JwtService;