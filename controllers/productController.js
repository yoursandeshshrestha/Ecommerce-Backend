const productModel = require("../models/productModel");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, stocks } = req.body;
    if (!name || !description || !price || !stocks) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      brand,
      stocks,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category, keyword } = req.query;
    const filter = {};

    // Search by category
    if (category) {
      filter.category = category;
    }

    // Search by keyword
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    const products = await productModel.find(filter).sort({ updatedAt: -1 });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const product = await productModel.findById(productID);

    if (!product) {
      return res.status(404).json({ message: "No product found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createProduct, getProducts, getSingleProduct };
