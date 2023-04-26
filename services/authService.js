const jwt = require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require('../utils/sendEmail');

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });
  const token =  createToken(user._id);
  
  res.status(201).json({ data: user, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("incorrect email", 401));
  }
  if (await bcrypt.compare(req.body.password, user.password)) {
  // if (req.body.password==user.password) {
    const token = createToken(user._id);
    return res.status(201).json({ data: user, token });
  };
  return next(new ApiError("incorrect password",401));
});

//to check if user loggedin
exports.auth = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new ApiError("you must login 1", 401));
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ApiError("you must login 2", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // Check whether the decoded userId is stored in the database.
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("you must login 3", 401));
    }
    req.user = currentUser;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError("you are not login", 401));
    }
    next(err);
  }
});

//Authorization permissions
exports.allowTo = (...roles) => asyncHandler(async (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError("you not allow to access this route ", 403));
  }
  next();
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {

  //1) get email to send resetCode.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user with this Email", 404));
  }

  //2) if this email is exists, Generate random 6 numbers and save in DB .
  const resetCode = Math.floor(Math.random() * 900000) + 100000;
  const hash = crypto
    .createHash("sha256")
    .update(resetCode.toString()) // convert resetCode to string
    .digest("hex");
  // save resetCode into DB
  user.ResetCode = hash;
  //Add expiration time to reset code (10min)
  user.ResetCodeExpireAt = Date.now() + (10 * 60 * 1000);
  user.ResetCodeVerified = false;
  await user.save();

  //3) send resetCode to email.
  const message = `Dear ${user.name},

We have received a request to reset the password for your email account associated with this email address. To proceed with resetting your password, please use the following 6-digit verification code:

 ${resetCode}

Please enter this code on the password reset page to verify your identity and continue the password reset process. This code will expire in 10 minutes for security reasons, so be sure to use it before then.

If you did not make this request, please ignore this message.

If you have any questions or concerns, please contact our support team at  E-commerce Ibraihm.

Thank you,
E-commerce Ibraihm`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Code",
      message
    });
  } catch (err) {
    user.ResetCode = undefined;
    user.ResetCodeExpireAt = undefined;
    user.ResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
 
  return res.status(200).json({ status: 'success', message: 'Check Your Email' });


});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {

  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode) // convert resetCode to string
    .digest("hex");
  console.log(hashedResetCode);
  const user = await User.findOne({ ResetCode: hashedResetCode, ResetCodeExpireAt: { $gt: Date.now() } });
  console.log(user);
  if (!user) {
    return next(new ApiError("Invalid Reset Code", 401));
  }
  user.ResetCodeVerified = true;
  await user.save();
  
  return res
    .status(200)
    .json({ status: "success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user with this Email", 404));
  }
  if (!user.ResetCodeVerified) {
    return next(new ApiError("Reset Code noot vertified", 400));
  }
  user.password = req.body.password;
      user.ResetCode = undefined;
      user.ResetCodeExpireAt = undefined;
      user.ResetCodeVerified = undefined;
  await user.save();
  const token = createToken(user._id);
    return res.status(200).json({
      status: "success",
      message: "you update Password successfully",
      token
    });


});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => { 
  req.params.id = req.user._id;
  next();
});

exports.logout = asyncHandler(async (req, res, next) => {
  // Clear the token by setting it to an invalid value
  res.cookie("token", "invalid-token", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out" });
});
