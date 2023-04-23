/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const SubCategory = require("../models/subCategoryModel");
const factory = require("./handersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadSubCategoryImage = uploadSingleImage("image");

exports.resizeImage = (req, res, next) => {
  const uniqueSuffix = `subCategory-${uuidv4()}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(200)
    .toFormat("jpeg")
    .toFile(`uploads/subCategories/${uniqueSuffix}`);
  req.body.image = uniqueSuffix;
  next();
};

exports.postSubCategory = factory.insertOne(SubCategory);

exports.getSubCategory = factory.getAll(SubCategory);

exports.getSubCategoryById = factory.getOne(SubCategory);

exports.updateSubCategory = factory.updateOne(SubCategory);

exports.deleteSubCategory = factory.deleteOne(SubCategory);