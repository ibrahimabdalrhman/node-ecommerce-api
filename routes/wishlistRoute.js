const express = require("express");

const router = express.Router();
const wishlistService = require("../services/wishlistService");
const { auth } = require("../services/authService");
const { postWishlistValidator } = require("../utils/validators/wishlistValidator");

router.use(auth)
router.route("/")
  .post(
    postWishlistValidator,
    wishlistService.addProductToWishlist)
  .get(
    wishlistService.getWishlist);

router.route("/:id")
  .delete(
    wishlistService.removeProductfromWishlist);


module.exports = router;