class ErrorHandler extends Error { //errorhandler class is child class 
    constructor (message, statusCode){
        super(message); //super is contructor of parent class
        this.statusCode =statusCode;

        //create stack property
        Error.captureStackTrace(this, this.constructor);
        //  we will show this in development and not in production
        //its shows the complete stack of errors in response

    }
}

export default ErrorHandler;