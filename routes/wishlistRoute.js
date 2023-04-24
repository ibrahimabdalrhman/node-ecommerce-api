const express = require("express");

const router = express.Router();
const wishlistService = require("../services/wishlistService");
const { auth } = require("../services/authService");



router.route("/")
  .post(auth,
    wishlistService.addProductToWishlist)
  .get(auth,
    wishlistService.getWishlist);

router.route("/:id")
  .delete(auth,
    wishlistService.removeProductfromWishlist);


module.exports = router;