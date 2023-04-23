const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: [true, "name of subcategory must be unique"],
            required: [true, "name of subcategory required"],
            trim: true,
        },
        slug: {
            type: String,
            unique: [true, "name of subcategory must be unique"],
            required: [true, "name of subcategory required"],
            trim: true,
            lowercase: true
        },
        image: {
            type: String,
            
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            required: [true, "subCategory must belong to category"]
        }
    },
    { timestamps: true }
);


subCategorySchema.post("init", (doc) => {
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/subCategories/${doc.image}`;
    doc.image = imageURL;
  }
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;