const { param, check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validationMiddleware");

exports.postAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias id required"),
  check("detalis")
    .notEmpty()
    .withMessage("detalis id required"),
  check("phone")
    .notEmpty()
    .withMessage("phone id required")
    .isNumeric()
    .withMessage("phone is Numeric"),
  check("city")
    .notEmpty()
    .withMessage("city id required"),
  check("postalCode")
    .notEmpty()
    .withMessage("phone id required")
    .isNumeric()
    .withMessage("phone is Numeric"),
  validationMiddleware,
];
