class CustomErrorHandler extends Error{
    constructor(status,msg){
        super();
        this.status=status;
        this.message=msg;
        console.log(msg);
    }
    
    static alreadyExists(message){
        return new CustomErrorHandler(409,message);
    }
    static wrongCredentials(message = "Email or Password invalid"){
        return new CustomErrorHandler(401,message);
    }

    static unAuthorized(message = "Not Authorized"){
        return new CustomErrorHandler(401,message);
    }
    
    static notFound(message = "Not Found"){
        return new CustomErrorHandler(404,message);
    }

    static serverError(message = "Server Error"){
        return new CustomErrorHandler(500,message);
    }
}

module.exports=CustomErrorHandler;