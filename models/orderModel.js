const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: [
      {
        details: String,
        city: String,
        phone: String,
        pastalCode: Number,
      }
    ],
    totalOrderPrice: {
      type: Number,
    },
    paymentMethodtype: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name profileImage email phone" });
  this.populate({ path: "cartItems.product", select: "title imageCover" });
  next();
});

module.exports = mongoose.model("Order", orderSchema);