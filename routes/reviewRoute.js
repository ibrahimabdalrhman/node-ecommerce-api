const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewService = require("../services/reviewService");
const {
  getReviewValidator,
  postReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const { auth, allowTo } = require("../services/authService");

router
  .route("/")
  .post(auth, allowTo("user"),
    postReviewValidator,
    reviewService.postReview)
  .get(reviewService.createFilterObj,
    reviewService.getReview);

router
  .route("/:id")
  .get(getReviewValidator, reviewService.getReviewById)
  .put(
    auth,
    allowTo("user"),
    updateReviewValidator,
    reviewService.updateReview
  )
  .delete(
    auth,
    allowTo("admin", "manager", "user"),
    deleteReviewValidator,
    reviewService.deleteReview
);;

module.exports = router;