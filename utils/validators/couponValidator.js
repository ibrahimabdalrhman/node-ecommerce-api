const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.postCouponValidator = [
  check("name").notEmpty().withMessage("name  required"),
  check("expire")
    .notEmpty()
    .withMessage("expire  required")
    .isDate()
    .withMessage("The expiration date must be in date format"),
  check("discount")
    .notEmpty()
    .withMessage("discount required")
    .isNumeric()
    .withMessage("Discount must be a number")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  validationMiddleware,
];

exports.updateCouponValidator = [
  param("id").isMongoId().withMessage("invalied id "),
  check("name").notEmpty().withMessage("name  required"),
  check("expire")
    .notEmpty()
    .withMessage("expire  required")
    .isDate()
    .withMessage("The expiration date must be in date format"),
  check("discount")
    .notEmpty()
    .withMessage("discount required")
    .isNumeric()
    .withMessage("Discount must be a number")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  validationMiddleware,
];

