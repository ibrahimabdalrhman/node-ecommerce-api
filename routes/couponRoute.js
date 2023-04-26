const express = require("express");

const router = express.Router();
const couponService = require("../services/couponService");

const { auth, allowTo } = require("../services/authService");

router.use(auth, allowTo("admin", "manager"));
router
  .route("/")
  .post( couponService.postCoupon)
  .get( couponService.getCoupon);

router
  .route("/:id")
  .get( couponService.getCouponById)
  .put( couponService.updateCoupon)
  .delete( couponService.deleteCoupon);

module.exports = router;