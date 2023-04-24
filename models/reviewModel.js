const { default: mongoose } = require('mongoose');
const monogoose = require("mongoose").set("strictQuery", false);;
const Product = require('./productModel');

const reviewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Min rating value is 5.0"],
      requird: [true, "rating required"]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must Belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must Belong to product"],
  
    },
  },
  { timestamps: true }
);

reviewsSchema.statics.clacAvgAndQuantity = async function (productId) {
  const results = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$rating" },
        ratingQuantity: { $sum: 1 }
      },
    },
  ]);
  console.log(results);
  if (results.length > 0) {
    await Product.findByIdAndUpdate(productId,{
      ratingsQuantity: results[0].ratingQuantity,
      ratingsAverage: results[0].avgRatings,
    });
    
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewsSchema.post('save',async function () {
  await this.constructor.clacAvgAndQuantity(this.product)
})

reviewsSchema.post("remove", async function () {
  await this.constructor.clacAvgAndQuantity(this.product);
});

reviewsSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name ",

  });
  next();
});

module.exports = mongoose.model("Review", reviewsSchema);