export default (controllerFunction) => (req,res,next) => 
    Promise.resolve(controllerFunction(req,res,next)).catch(next); 
//if there is any error, 'catch' will catch the error and pass it to next middleware
//next is the express middleware that we call in the middleware stack


//overall the dafault function is going to return another function that has request, response and next
// now this function in turn returns a promise, so if there is any error in the controllerFunction(2nd),
// catch will catch that error and pass that to the next middleware 