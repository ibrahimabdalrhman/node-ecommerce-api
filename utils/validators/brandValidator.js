const { param, check ,body} = require("express-validator");
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');

exports.getBrandValidator = [
    param("id").isMongoId().withMessage("invalied brand id"),
    validationMiddleware,
];

exports.postBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("brand name required")
        .isLength({ min: 3 })
        .withMessage("too short brand name")
        .isLength({ max: 33 })
        .withMessage("too long brand name"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware,
];

exports.updateBrandValidator = [
    param("id").isMongoId().withMessage("invalied brand id"),
    body('name')
        .optional()
        .custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware,
];

exports.deleteBrandValidator = [
    param("id").isMongoId().withMessage("invalied brand id"),
    validationMiddleware,
];
