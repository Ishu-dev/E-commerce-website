# E-commerce-website

selected git bash as terminal
npm init
npm i express dotenv mongoose --save
add type->module to package.json
backend and frontend folder
backend/config
node app.js
npm i nodemon --save-dev
package.json -> edit script , replace test with start-> node backend/app.js
package.json -> edit script , "dev": "nodemon backend/app.js" used so as we dont have to restart our application again and again
package.json -> edit script , "prod": "SET NODE_ENV=PRODUCTION& nodemon backend/app.js" used to tart our server in production mode

7. ----------Creating routes---------
   backend->controllers and routes folders
   controller functions can be used in route files
   in controller functions we are going to write logic for our end points
   controllers->productControllers.js
   export const getProducts =async (req,res) ->logic to fetch all products from our database
   create routes->products.js -> router.route("/products").get(getProducts);
   app.js -> app.use("/api/v1", productRoutes);
   postman -> http://localhost:4000/api/v1/products GET

8. setting up postman domain, group and folder to get all products

9. config -> dbConnect.js
   mongoose.connect -> add connection string
   config.env -> DB_LOCAL_URI=mongodb://127.0.0.1:27017/shopit-v2 here shopit-v2 is database name
   dbConnect.js -> mongoose.connect(DB_URI).then((con)=>{
   console.log(
   `MongoDB Database connected with HOST: ${con?.connection?.host}`
   );
   });
   here con stands for connection
   app.js -> connectDatabase() also import connectDatabase from dbConnect.js

10. routes->product.js
    product schema

11. --------(Create new product)
    controllers-> productControllers.js ->export const newProduct
    routes-> products.js-> router.route("/admin/products").post(newProduct);

postman -> create new produt ->POST method

12. --------(get new product)
    productcontrollers.js-> export const getProducts =async (req,res) => {
    const product =await Product.find();

13. seeder file
    seeder-> data.js and seeder.js
    seeder.js -> change 'localhost' to -> await mongoose.connect("mongodb://127.0.0.1:27017/shopit-v2");
    A data seeder has multiple uses, but its main purpose is to populate a database with initial data.

14. --------(get single product)

15. ---------(update Product)

16. ---------(delete product)

17. -----------error handler-------------
    throw new error() in productControllers.js
    If we want to create custom error handler-
    create folder utils
    utils->errorHandler.js

18. - create middlewares->errors.js->
      export default (err, req,res,next) => {
      let error={
      statusCode: err?.statusCode || 500, // 500 default internal server error
      message: err?.message || 'Internal Server Error',
      };

          res.status(error.statusCode).json({
              message: error.message,
          });

      }
      and
      app.js -> import errorMiddleware from "./middlewares/errors.js";
      and
      app.use(errorMiddleware);
      make some changes in productControllers.js->getProductDetails->
      if (!product) {
      return next(new ErrorHandler("Product not Found", 404));
      //next is a middleware provided by expressjs to execute next middleware in middleware stack
      }

19. -------------production vs developement errors
    middleware->errors.js ->
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
    res.status(error.statusCode).json({
    message: error.message,
    error: err,
    stack: err?.stack,
    });
    }
    if(process.env.NODE_ENV === 'PRODUCTION'){
    res.status(error.statusCode).json({
    message: error.message,
    });
    }

now if we go to postman and get single product then in DEVELOPMENT mode (npm run dev)
we will get below output
{
"message": "Product not Found",
"error": {
"statusCode": 404
},
"stack": "Error: Product not Found\n at getProductDetails
(file:///C:/Users/Ishu%20Chaudhary/Desktop/Interview%20Prep/projects/EcommerceWebsite/backend/controllers
/productControllers.js:28:17)\n at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"
}

PRODUCTION mode (npm run prod)
we will get error in terminal.
for solving that, go to config->config.env->
DB_LOCAL_URI=mongodb://127.0.0.1:27017/shopit-v2
DB_URI=
change this to
DB_LOCAL_URI=mongodb://127.0.0.1:27017/shopit-v2
DB_URI=mongodb://127.0.0.1:27017/shopit-v2
then
ctrl+C -> npm run prod

now go to postman and send a GET request to th output will be
{
"message": "Product not Found"
}

20. -------unhandled promise rejection error---------------------------
    if we type incorrectly
    config->config.env->
    DB_LOCAL_URI=mon://127.0.0.1:27017/shopit-v2 //mon instead of mongodb
    we get error
    throw new mongoParseError

to solve this
app.js
make some changes const server = app.listen().......
and
//handle unhandled promise rejection error
process.on('unhandledRejection', (err) => {
console.log(`ERROR: ${err}`);
console.log('Shutting down server due to unhandled promise');
server.close(() => {
process.exit(1);
})
})

21. -----------handling uncaught exception error
    app.js->
    process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err}`);
    console.log('shutting down due to uncaught exception');
    process.exit(1);
    });

22. ----------handling mongoose aysnc error
    first we create our global error handler
    catchAsyncErrors.js they will catch the error and return proper error message
    -> export default (controllerFunction) => (req,res,next) =>
    Promise.resolve(controllerFunction(req,res,next)).catch(next);
    //if there is any error, 'catch' will catch the error and pass it to next middleware
    //next is the express middleware that we call in the middleware stack

//overall the dafault function is going to return another function that has request, response and next
// now this function in turn returns a promise, so if there is any error in the controllerFunction(2nd),
// catch will catch that error and pass that to the next middleware

productControllers.js->
wrap all the async function in catchAsyncErrors(async ....)

also use this -> return next(new ErrorHandler("Product not Found", 404));
in every if(!product) function
instead of
return res.status(404).json({
error: "Product not found",
});

//if we dont use catchAsyncErrors and type in a id of product which is not in our
directory then the request will load for infinite amount of time

23. ---------handle wrong mongooseID error or validation error--------------
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

//mongooseID error occur when we enter wrong id in any request like getProductDetails
//validation errors occurs when we do not enter all the required details of a product
while creating or updating a new product

24. -------search products by filters--------
    utils->apiFilters.js

productControllers.js ->
const apiFilters = new APIFilters(Product, req.query).search();
let products = await apiFilters.query;
let filteredProductsCount = products.length;

25. ***

26. pagination
    utils->apiFilters.js

27. -------create user model---------
    models->users.js

28. -------encrypting password while registring------------
    controllers -> authControllers.js
    routes -> auth.js
    app.js -> import authRoutes from "./routes/auth.js";
    app.use("/api/v1", authRoutes);
    models->user.js (encrupting password)
    install npm i bcryptjs --save
    // bcryptjs helps to encrypt the password
    user.js ->userSchema.pre("save", async function (next))
    used mongoose "pre" function which states that before saving the new user, simply run the inside function
    now enter a new user in postman, we see in monodb compass that our password is encrypted

29. --------generate json web token (JSW)------
    jsw token used in authentication, we generate a token which is a random string in which we store user id
    or any user data.then we assign that token to user, if the user is authorized. then we assign a expiry to the token.
    then we validate the user or authorize the user based on that token, once the token is expired,
    we ask the user to login again
    terminal -> npm i jsonwebtoken --save
    models->user.js -> userSchema.methods.getJWTToken =function()
    config->config.env ->
    JWT_SECRET= //random string input karo
    JWT_EXPIRES_TIME=7d
    controllers->authControllers.js -> const token = user.getJWTToken();
    //now in postman save the {{DOMAIN}}/api/v1/register as Register user
    when we add a new user, we get a token in response. we copy that token response and go to jwt.io.
    there we paste the token and we can see the gap of 7 days in when we hover over it.

30. --------Login User and assign token-----------
    controllers->authControllers.js->
    export const loginUser
    check password is correct-> const isPasswordMatched = await user.comparePassword(password)
    model->users.js -> userSchema.methods.comparePassword = async function(enteredPassword)
    routes->auth.js ->

31. ---------Sending JWT token in cookie------------
    createing a funvtion that will assign the token and save that token in cookie.
    http only cookie-> can be accessed only from server side, can not be accessed from client side.
    we have to save the token to check before each request that it is autheniticated or not, for that we have to save token
    best way is http only cookie because that can not be accessed from frontend, only through backend
    utils-> sendToken.js ->
    config-> config.env-> COOKIE_EXPIRES_TIME=7
    controllers->authControllers.js-> sendToken(user, 201, res); in login and register

32. to ensure all the routes in routes-> products.js are safe
    middleware->auth.js
    install cookie parser -> npm i cookie-parser --save
    app.js->import cookieParser
    routes->products.js -> router.route("/products").get(isAuthenticatedUser ,getProducts);
    in postman we send getAllProducts request with no filter ->{ id: '65a4a88ac9fe767e4f646ca9', iat: 1705394740, exp: 1705999540 } id, expiry, creation
    we need only id, find the user with that id in the database
    we will set the user in the request so that we can access that in our routes
    
33. ------logout user ------
    we have to remove/clear the cookie
    set cookie value to null
    if cookie is not there then user is logged out
    
