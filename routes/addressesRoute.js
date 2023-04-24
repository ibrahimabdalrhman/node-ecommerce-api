const express = require("express");

const router = express.Router();
const addressesService = require("../services/addressesService");
const { auth } = require("../services/authService");


router
  .route("/")
  .post(auth, addressesService.addAddress)
  .get(auth, addressesService.getAddress);

router.route("/:id").delete(auth, addressesService.removeAddress);


module.exports = router;