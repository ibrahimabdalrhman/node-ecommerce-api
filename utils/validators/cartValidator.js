const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");
const Product = require("../../models/productModel");

exports.postCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("product id required")
    .isMongoId()
    .withMessage("invalied product id"),
  body("productId").custom((val) => {
    return Product.findById(val).then((product) => {
      if (!product) {
        return Promise.reject(new Error(`product not found`));
      }
      return true;
    });
  }),
  validationMiddleware,
];
