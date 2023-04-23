/* eslint-disable array-callback-return */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const Product = require('../models/productModel');
const factory = require('./handersFactory');
const { uploadMultipleImages } = require("../middlewares/uploadImageMiddleware");


exports.uploadProductsImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 4,
  },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.files && req.files.imageCover) {
    const imagesCovername = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(200)
      .toFormat("jpeg")
      .toFile(`uploads/products/${imagesCovername}`);
    req.body.imageCover = imagesCovername;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(200)
          .toFormat("jpeg")
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

exports.postProduct = factory.insertOne(Product);

exports.getProducts = factory.getAll(Product,'Products');

exports.getProductById = factory.getOne(Product,"reviews");

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);