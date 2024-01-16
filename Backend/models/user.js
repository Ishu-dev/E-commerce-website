import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      maxLength: [50, "Your name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minLength: [6, "Your password must be longer than 6 characters"],
      select: false, //dont want to send password in respinse to the user
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

//encrypting password before saving the user
userSchema.pre("save", async function (next) {
  //
  //if we use arrow function here, we can not use this->
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10); //encrypt it to 10 letters
}); //before saving user data, save the password

//return JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
  //payload is the data that we want to save in the token, in our case,we want to save only id of the user
  //secretorprivatekey is
  //options put expriry date -> after x days, user has to login again
};

//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model("User", userSchema);
