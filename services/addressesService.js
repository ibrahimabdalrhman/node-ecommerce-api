const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  
  res.status(200).json({
    status: "success",
    message: "address added successfully",
    data: user.addresses,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address deleted successfully",
    data: user.addresses,
  });
});

exports.getAddress = asyncHandler(async (req, res, next) => {
  const documents = await User.findById(req.user._id).populate({
    path: "addresses"  });

  res.status(200).json({
    status: "success",
    data: documents.addresses,
  });
});
