const express = require("express");

const router = express.Router();
const addressesService = require("../services/addressesService");
const { auth } = require("../services/authService");
const {
  postAddressValidator,
} = require("../utils/validators/addressValidator");

router.use(auth);
router
  .route("/")
  .post( postAddressValidator, addressesService.addAddress)
  .get( addressesService.getAddress);

router.route("/:id").delete( addressesService.removeAddress);


module.exports = router;