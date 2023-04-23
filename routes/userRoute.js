const express = require("express");

const router = express.Router();
const userService = require('../services/userService');

const { getUserValidator,
    postUserValidator,
    deleteUserValidator,
    updateUserValidator,
updateUserPasswordValidator } = require('../utils/validators/userValidator');
const { auth, allowTo,getLoggedUserData } = require("../services/authService");

router
  .route("/myprofile")
  .get(auth, getLoggedUserData, userService.getUserById)
  .put(
    auth,
    userService.uploadUserImage,
    userService.resizeImage,
    getLoggedUserData,
    updateUserValidator,
    userService.updateUser
  );
router.route("/myprofile/changepassword").put(
  auth,
  getLoggedUserData,
  updateUserPasswordValidator,
  userService.updateUserPassword,
);

router
  .route("/")
  .post(
    auth,
    allowTo("admin"),
    userService.uploadUserImage,
    userService.resizeImage,
    postUserValidator,
    userService.postUser
  )
  .get(auth, userService.getUser);

router
  .route("/:id")
  .get(auth, getUserValidator, userService.getUserById)
  .put(
    auth,
    allowTo("admin"),
    userService.uploadUserImage,
    userService.resizeImage,
    updateUserValidator,
    userService.updateUser
  )
  .delete(
    auth,
    allowTo("admin"),
    deleteUserValidator,
    userService.deleteUser);

router
  .route("/change-password/:id")
  .put(
    auth,
    allowTo("admin"),
    updateUserPasswordValidator,
    userService.updateUserPassword
);
  

    

module.exports = router;