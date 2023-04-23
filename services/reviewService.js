const Review = require("../models/reviewModel");
const factory = require("./handersFactory");


exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.prodId) filterObject = { product: req.params.prodId };

  req.filterObj = filterObject;
  next();
};

exports.postReview = factory.insertOne(Review);

exports.getReview = factory.getAll(Review);

exports.getReviewById = factory.getOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);