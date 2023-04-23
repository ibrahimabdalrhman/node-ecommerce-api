/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const { param, check, body } = require("express-validator");
const slugify = require('slugify');
const validationMiddleware = require('../../middlewares/validationMiddleware');
const User = require("../../models/userModel");

exports.getUserValidator = [
    param("id").isMongoId().withMessage("invalied user id"),
    validationMiddleware,
];

exports.postUserValidator = [
    check("name")
        .notEmpty()
        .withMessage("user name required")
        .isLength({ min: 3 })
        .withMessage("too short user name"),
    body("name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .notEmpty()
        .withMessage("user email required")
        .isEmail()
        .withMessage("invalied email address")
        .custom((val) => User.findOne({ email: val }).then((user) => {
            if (user) {
                return Promise.reject(new Error("user already exists"));
            }
        })),
    check("password")
        .notEmpty()
        .withMessage("user password required")
        .isLength({ min: 6 })
        .withMessage("too short user password"),
    check("passwordConfirm")
        .notEmpty()
        .withMessage(" password Confirm required")
        .custom((val, { req} )=> {
            if (val !== req.body.password) {
                return Promise.reject(new Error("password confiration incorrect"));
            }
            return true;
        }),
    check("profileImage")
        .optional(),
    check("phone")
        .optional()
        .isMobilePhone(["ar-SA", "ar-EG"])
        .withMessage('invalid mobile Phone number')
    ,

    validationMiddleware,
];

exports.updateUserValidator = [
    check("name")
        .optional()
        .notEmpty()
        .withMessage("user name required")
        .isLength({ min: 3 })
        .withMessage("too short user name"),
    body("name")
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .optional()
        .notEmpty()
        .withMessage("user email required")
        .isEmail()
        .withMessage("invalied email address")
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("user already exists"));
                }
            })
        ),
    check("profileImage").optional(),
    check("phone")
        .optional()
        .isMobilePhone(["ar-SA", "ar-EG"])
        .withMessage("invalid mobile Phone number"),
    validationMiddleware,
];

exports.deleteUserValidator = [
    param("id").isMongoId().withMessage("invalied user id"),
    validationMiddleware,
];

exports.updateUserPasswordValidator = [
    param("id").isMongoId().withMessage("invalied user id"),
    check("currentPassword")
        .notEmpty()
        .withMessage("current password required")
        .custom(async (val, { req }) => {
            const user = await User.findById(req.params.id);
            const match = await bcrypt.compare(val, user.password);
            if (match) {
                return true;
            }
            return Promise.reject(
                new Error("current Password incorrect")
            );
        }),
    check("password")
        .notEmpty()
        .withMessage("user password required")
        .isLength({ min: 6 })
        .withMessage("too short user password"),
    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password Confirm required")
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                return Promise.reject(new Error("password confiration incorrect"));
            }
            return true;
        }),
    validationMiddleware,
];
