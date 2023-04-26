const express = require('express');
const router = express.Router();
const cartService = require("../services/cartService");
const { auth, allowTo } = require("../services/authService");

router.use(auth, allowTo("user"));
router
  .route("/")
  .post(cartService.addProductToCart)
  .get(cartService.getCart)
  .delete(cartService.clearCart);

  
router
  .route("/:id")
  .put(cartService.updateProductQuantity)
  .delete(cartService.removeProductFromCart);

module.exports = router;
