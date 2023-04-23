/* eslint-disable import/no-extraneous-dependencies */
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Brand = require('../models/brandModel');
const factory = require("./handersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = (req, res, next) => {
  if (req.file) {
    const uniqueSuffix = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(200)
      .toFormat("jpeg")
      .toFile(`uploads/brands/${uniqueSuffix}`);
    req.body.image = uniqueSuffix;
  }
  next();
};

exports.postBrand = factory.insertOne(Brand);

exports.getBrand = factory.getAll(Brand);

exports.getBrandById = factory.getOne(Brand);

exports.updateBrand = factory.updateOne(Brand);

exports.deleteBrand = factory.deleteOne(Brand);