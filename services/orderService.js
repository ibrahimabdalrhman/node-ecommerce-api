const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const factory = require("../services/handersFactory");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  let shippingPrice = 0;
  let taxPrice = 0;

  //1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  //2)get order price depend on total price of cart
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //3)create order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4)decrement product quantity and increment product sold
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  const bulkOption = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOption, {});
  //5)clear user cart
  await Cart.findByIdAndDelete(req.params.cartId);

  res.status(200).json({ status: "success", data: order });
});

exports.getLoggedUserOrder = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    req.filterObj = { user: req.user._id };
  }
  next();
});

exports.getAllOrders = factory.getAll(Order);

exports.getSpecificOrder = asyncHandler(async (req, res, next) => {
  if (req.user.role == "user") {
    const order = await Order.findOne({
      user: req.user._id,
      _id: req.params.orderId,
    });
    if (!order) {
      return next(new ApiError("can't find order", 404));
    }
    return res.status(200).json({ status: "success", data: order });
  }
  const order = await Order.findOne({
    _id: req.params.orderId,
  });
  res.status(200).json({ status: "success", data: order });
});

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { paidAt: Date.now(), isPaid: true },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("can't find order", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { deliveredAt: Date.now(), isDelivered: true },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("can't find order", 404));
  }
  res.status(200).json({ status: "success", data: order });
});

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  let shippingPrice = 0;
  let taxPrice = 0;

  //1) get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart Not Found", 404));
  }

  //2)get order price depend on total price of cart
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice*100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(200).json({ status: "success", data: session });
});

exports.webhookCheckout = async (req, res) => {
  console.log("webhookCheckout 1");

  const sig = req.headers["stripe-signature"];
  console.log("sig : ", sig);

  let event;

  try {
    console.log("in try");


    event = stripe.webhooks.constructEvent(
      req.rawBody.toString(),
      sig,
      "whsec_ZbTMDNlfx2xNl7W1FEe8zO18B4WS4zEG"
    );
    console.log("event : ", event);
  } catch (err) {
    console.log("ERROR ==>> ", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {

    console.log("create order here.................");

    //create order
    const cart = await Cart.findById(event.data.object.client_reference_id);
    if (!cart) {
      return next(new ApiError("Cart Not Found", 404));
    }
    const user = await User.findOne({
      email: event.data.object.customer_email,
    });
    const order = await Order.create({
      user: user._id,
      cartItems: cart.cartItems,
      shippingAddress: event.data.object.metadata,
      totalOrderPrice: event.data.object.amount_total / 100,
      paymentMethodtype: "card",
      isPaid: true,
      paidAt: Date.now(),
    });
    if (order) {
      const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      }));

      await Product.bulkWrite(bulkOption, {});
      //     //5)clear user cart
      await Cart.findByIdAndDelete(event.data.object.client_reference_id);
    }
  }

  res.status(200).json({ received: "success" });


};
