const { param, check,body } = require("express-validator");
const slugify = require("slugify");
const validationMiddleware = require('../../middlewares/validationMiddleware');

exports.getSubCategoryValidator = [
    param('id').isMongoId().withMessage('invalied SubCategory id'),
    validationMiddleware
];

exports.postSubCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("SubCategory name required")
        .isLength({ min: 3 })
        .withMessage("too short SubCategory name")
        .isLength({ max: 33 })
        .withMessage("too long SubCategory name"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    param("id").isMongoId().withMessage("invalied SubCategory id")
        .custom((val, { req })=> {
            req.body.category = val;
            return true;
        }),
    validationMiddleware,
];

exports.updateSubCategoryValidator = [
    param("id").isMongoId().withMessage("invalied SubCategory id"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware,
];

exports.deleteSubCategoryValidator = [
    param("id").isMongoId().withMessage("invalied SubCategory id"),
    validationMiddleware,
];
