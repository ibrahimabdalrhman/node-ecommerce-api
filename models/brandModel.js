const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique:true,
            minLength: [3, "too short brand name"],
            maxLength: [30, "too long brand name"],
            required: [true, "brand name required"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

brandSchema.post("init", (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;