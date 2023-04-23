const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            minLength: [3, "too short category name"],
            maxLength: [30, "too long category name"],
            required: [true, "category name required"],
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

categorySchema.post('init', (doc) => {
    if (doc.image) {
        const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageURL;
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports=Category;