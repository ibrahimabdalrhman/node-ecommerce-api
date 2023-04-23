const { param, check,body } = require("express-validator");
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');

exports.getCategoryValidator = [
    param('id').isMongoId().withMessage('invalied category id'),
    validationMiddleware
];

exports.postCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("category name required")
        .isLength({ min: 3 })
        .withMessage("too short category name")
        .isLength({ max: 33 })
        .withMessage("too long category name"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware,
];

exports.updateCategoryValidator = [
    param("id").isMongoId().withMessage("invalied category id"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validationMiddleware,
];

exports.deleteCategoryValidator = [
    param("id").isMongoId().withMessage("invalied category id"),
    validationMiddleware,
];
