import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500, // 500 default internal server error
    message: err?.message || "Internal Server Error",
  };

  

  //23 handle wrong mongooseID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid path: ${err.path}`;
    error = new ErrorHandler(message, 404);
  }

  //23 handle validation errors
  if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map((value) => value.message)
    error = new ErrorHandler(message, 400);
  }


  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
