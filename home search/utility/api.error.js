class Api_error extends Error{
    constructor(
        statuscode,message,error=[], stack=""
    ){
        super(message);
        this.statuscode=statuscode;
        this.message=message;
        this.error=error;
        this.success=false;
        if(stack){
            this.stack=stack
        }else{
             Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default Api_error