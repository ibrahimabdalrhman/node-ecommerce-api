const express = require("express");

const router = express.Router();
const brandService = require('../services/brandService');
const {
    getBrandValidator,
    postBrandValidator,
    updateBrandValidator,
    deleteBrandValidator } = require('../utils/validators/brandValidator');
const { auth, allowTo } = require("../services/authService");

router
  .route("/")
  .post(
    auth,
    allowTo("admin", "manager"),
    brandService.uploadBrandImage,
    brandService.resizeImage,
    postBrandValidator,
    brandService.postBrand
  )
  .get(brandService.getBrand);

router
  .route("/:id")
  .get(getBrandValidator, brandService.getBrandById)
  .put(
    auth,
    allowTo("admin", "manager"),
    brandService.uploadBrandImage,
    brandService.resizeImage,
    updateBrandValidator,
    brandService.updateBrand
  )
  .delete(
    auth,
    allowTo("admin", "manager"),
    deleteBrandValidator,
    brandService.deleteBrand
  );

module.exports = router;