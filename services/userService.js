/* eslint-disable import/no-extraneous-dependencies */
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const User = require('../models/userModel');
const factory = require("./handersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = (req, res, next) => {
  const uniqueSuffix = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    sharp(req.file.buffer)
      .resize(200)
      .toFormat("jpeg")
      .toFile(`uploads/users/${uniqueSuffix}`);
    req.body.profileImage = uniqueSuffix;
  }
  next();
  
};

exports.postUser = factory.insertOne(User);

exports.getUser = factory.getAll(User);

exports.getUserById = factory.getOne(User);

// exports.updateUser = factory.updateOne(User);

exports.updateUserPassword = async (req, res, next) => {

  const doc = await User.findByIdAndUpdate(
    req.params.id,
    { password:req.body.password },
    { new: true }
  );
  if (!doc) {
    return next(new ApiError(" not found", 404));
  }
  res.status(200).json({
    msg: doc,
  });
};


exports.updateUser = async (req, res, next) => {
  
  const doc = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
      active: req.body.active,
    },
    { new: true }
  );
  if (!doc) {
    return next(new ApiError(" not found", 404));
  }
  res.status(200).json({
    msg: doc,
  });
};

exports.deleteUser = factory.deleteOne(User);