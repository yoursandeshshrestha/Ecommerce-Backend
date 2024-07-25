const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter description name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please enter price"],
    min: 0,
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  category: {
    type: String,
    required: [true, "Please enter category"],
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  stocks: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: "text" });

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
