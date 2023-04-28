const express = require('express');
const {
  createCashOrder,
  getAllOrders,
  getSpecificOrder,
  getLoggedUserOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../services/orderService");
const router = express.Router();
const { auth, allowTo } = require('../services/authService');

router.use(auth);

router.route("/checkout-session/:cartId").get(allowTo("user"), checkoutSession);

router.route('/:cartId').post(allowTo('user'), createCashOrder);

router.route('/').get(allowTo('manager', 'admin', 'user'), getLoggedUserOrder, getAllOrders);

router.route('/:orderId').get(getSpecificOrder);

router.route('/:orderId/paid').put(allowTo("admin", "manager"), updateOrderToPaid);

router.route('/:orderId/delivered').put(allowTo("admin", "manager"), updateOrderToDelivered);



module.exports = router;
