const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  
  const { productId, color } = req.body;
  const bodyQuantity = req.body.quantity||1;
  const product = await Product.findById(productId)
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
          quantity: bodyQuantity,
        },
      ],
    });
  } else {

    const productIndex = cart.cartItems.findIndex((item) =>
      item.product.toString() === productId && item.color === color);
    
    if (productIndex >= 0) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity++;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
        quantity: bodyQuantity,
      });
    }
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(201).json({ status: "success", data: cart });
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart Not Found",404));
  }
  res.status(200).json({ status: "success", length: cart.cartItems.length, data: cart });

});

exports.removeProductFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { product: req.params.id } } },
    { new: true }
  );
    if (!cart) {
      return next(new ApiError("Cart Not Found", 404));
    }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(204).json({
    status: "success",
    message: "product deleted from your cart successfully",
    data: req.user.cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }
  cart.cartItems = []
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(204).json({
    status: "success",
    message: "cleared cart successfully",
    data: req.user.cart,
  });
});

exports.updateProductQuantity = asyncHandler(async (req, res, next) => {
  const quantity = req.body.quantity;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }
  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  if (productIndex >= 0) {
    cart.cartItems[productIndex].quantity = quantity;
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(201).json({
      status: "success",
      message: "updated quantity successfully",
      data: cart,
    });
  } else {
    return next(new ApiError("can't find product in cart", 404));
  }
});
