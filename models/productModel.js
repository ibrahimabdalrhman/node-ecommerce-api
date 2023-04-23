/* eslint-disable array-callback-return */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "too short"],
      maxLength: [150, "too long"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowewrcase: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "quantity required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "price required"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "You must add at least a image to cover"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must belongs to category"],
    },
    subCategory: [{
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    }],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal to 1"],
      max: [5, "Rating must be less or equal to 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    comments: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function(next){

  this.populate({
    path: "category brand subCategory",
    select: "name -_id"
  })
  next();
});

productSchema.post("init", (doc) => {
  const images=[]
  if (doc.images) {
    doc.images.map((img) => {
      const imageName = `${process.env.BASE_URL}/products/${img}`;
      images.push(imageName);
    });
    doc.images=images;
  }
});

productSchema.post("init", (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }
});

module.exports = mongoose.model('Product', productSchema);