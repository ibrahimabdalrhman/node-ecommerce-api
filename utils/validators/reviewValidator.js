const { param, check ,body} = require("express-validator");
const validationMiddleware = require('../../middlewares/validationMiddleware');
const Review = require('../../models/reviewModel');


exports.getReviewValidator = [
    param("id").isMongoId().withMessage("invalied review id"),
    validationMiddleware,
];

exports.postReviewValidator = [
    check("title").optional(),
    check("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating value must be between 1 to 5")
        .custom((val, { req }) => {
            req.body.user = req.user._id;
            return true;
        }),
    check("product")
        .notEmpty()
        .withMessage(" product required")
        .isMongoId()
        .withMessage("invalied product id")
        .custom(async (val, { req }) => {
            const review = await Review.findOne({
                user: req.body.user,
                product: req.body.product,
            });
            if (review) {
                return Promise.reject(new Error("You already create review before"));
            }
        }).custom((val, { req }) => {
            req.body.user = req.user._id;
            return true;
        }),
    validationMiddleware,
];

exports.updateReviewValidator = [
  param("id")
    .isMongoId()
    .withMessage("invalied review id")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        return Promise.reject(
          new Error(`There is no review with thid Id ${val}`)
        );
      }

      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`You are not allow to update this review`)
        );
      }
      return true;
    }),
  check("title").optional(),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5"),
  validationMiddleware,
];

exports.deleteReviewValidator = [
    param("id")
        .isMongoId()
        .withMessage("invalied review id")
        .custom(async (val, { req }) => {
            const review = await Review.findById(val);
            if (!review) {
                return Promise.reject(new Error(`There is no review with thid Id ${val}`));
            }
            if (req.user.role === "admin" || req.user.role === "manager") {
                return true;

            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                return Promise.reject(
                    new Error(`You are not alllow to delete this review`)
                );
            }
            return true;
        })
    ,
    validationMiddleware,
];
