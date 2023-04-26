const express = require('express');
const router = express.Router();
const cartService = require("../services/cartService");
const { auth, allowTo } = require("../services/authService");
const { postCartValidator } = require('../utils/validators/cartValidator');

router.use(auth, allowTo("user"));

router
  .route("/")
  .post(postCartValidator, cartService.addProductToCart)
  .get(cartService.getCart)
  .delete(cartService.clearCart);

router
  .route("/:id")
  .put(cartService.updateProductQuantity)
  .delete( cartService.removeProductFromCart);

router.route("/coupon").post(cartService.applyCoupon);

module.exports = router;
