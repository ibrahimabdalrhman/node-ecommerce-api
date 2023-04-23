/* eslint-disable import/order */
/* eslint-disable import/no-extraneous-dependencies */
const Category = require('../models/categoryModel');
const factory = require("./handersFactory");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage} = require('../middlewares/uploadImageMiddleware');


exports.uploadCategoryImage = uploadSingleImage('image');

exports.resizeImage = (req, res, next) => {
  const uniqueSuffix = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    sharp(req.file.buffer)
      .resize(200)
      .toFormat("jpeg")
      .toFile(`uploads/categories/${uniqueSuffix}`);
    req.body.image = uniqueSuffix;
  }
  next();

};

exports.postCategory = factory.insertOne(Category);

exports.getCategory = factory.getAll(Category);

exports.getCategoryById = factory.getOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);