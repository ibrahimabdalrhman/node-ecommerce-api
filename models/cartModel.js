const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

  cartItems: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      quantity: Number,
      color: String,
      price: Number,
    }
  ],
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// cartSchema.pre( "save",  function (next) {
//     let total = 0;
//     for (let item of this.cartItems) {
//       total += item.quantity * item.price;
//     }
//     this.totalPrice = total;
//     next();
//   }
// );

module.exports = mongoose.model('Cart', cartSchema);