const express = require("express");

const router = express.Router();
const couponService = require("../services/couponService");

const { auth, allowTo } = require("../services/authService");
const {
  postCouponValidator,updateCouponValidator,
} = require("../utils/validators/couponValidator");

router.use(auth, allowTo("admin", "manager"));
router
  .route("/")
  .post(postCouponValidator,couponService.postCoupon)
  .get(couponService.getCoupon);

router
  .route("/:id")
  .get(couponService.getCouponById)
  .put(updateCouponValidator,couponService.updateCoupon)
  .delete(couponService.deleteCoupon);

module.exports = router;