const Coupon = require("../models/couponModel");
const factory = require("./handersFactory");



exports.postCoupon = factory.insertOne(Coupon);

exports.getCoupon = factory.getAll(Coupon);

exports.getCouponById = factory.getOne(Coupon);

exports.updateCoupon = factory.updateOne(Coupon);

exports.deleteCoupon = factory.deleteOne(Coupon);
