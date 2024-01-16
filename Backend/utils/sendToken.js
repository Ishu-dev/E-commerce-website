//create token and save in the cookie
export default (user, statusCode, res) => {
  //create JWT token
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 1000 * 60 * 60 * 24 * 7
    ), //as our token expires in 7 days, we have to expire the cookie in 7 days
    httpOnly: true, //because http cookie can not be accessed from ffrontend and only accessed from backend
    //if httpOnly =false then cookie can be accessed from frontend
  };

//   console.log(options);

  res.status(statusCode).cookie("token", token, options).json({
    token,
  });
};


//1. create token
//2. create options, pass cookie expire time
//3. set the cookie
