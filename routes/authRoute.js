const express = require("express");

const router = express.Router();
const authService = require('../services/authService');
const userService = require("../services/userService");
const {
  signupValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

router
    .route("/signup")
    .post(
        signupValidator,
        authService.signup
);
    
router
    .route("/login")
    .post(
        loginValidator,
        authService.login
);

router
    .route("/logout")
    .get(
        authService.logout
);
    
router
    .route("/forgetpassword")
    .post(
        forgetPasswordValidator,
        authService.forgetPassword
);
    
router
    .route("/resetcode")
    .post(
        authService.verifyResetCode
);
    
router
    .route("/resetPassword")
    .post(resetPasswordValidator,
        authService.resetPassword
);



module.exports = router;