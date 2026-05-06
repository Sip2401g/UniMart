const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Books", "Electronics", "Furniture", "Clothing", "Stationery", "Sports", "Other"],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    images: [{ type: String }],  // array of image filenames
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isSold: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);