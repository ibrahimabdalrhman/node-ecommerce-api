const express = require("express");

const router = express.Router();
const productService = require("../services/productService");
const reviewRoute = require('./reviewRoute');
const {
  getProductValidator,
  postProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const { auth, allowTo } = require("../services/authService");

router.use("/:prodId/reviews", reviewRoute);

router
  .route("/")
  .post(
    auth,
    allowTo("admin", "manager"),
    productService.uploadProductsImages,
    productService.resizeImage,
    postProductValidator,
    productService.postProduct
  )
  .get(productService.getProducts);

router
  .route("/:id")
  .get(getProductValidator, productService.getProductById)
  .put(
    auth,
    allowTo("admin", "manager"),
    productService.uploadProductsImages,
    productService.resizeImage,
    updateProductValidator,
    productService.updateProduct
  )
  .delete(
    auth,
    allowTo("admin", "manager"),
    deleteProductValidator,
    productService.deleteProduct
  );

module.exports = router;
