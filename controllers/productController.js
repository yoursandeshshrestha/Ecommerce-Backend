const productModel = require("../models/productModel");

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    if ((!name, !description, !price, !stock)) {
      return res.status(402).json({ message: "Please fill in all fields" });
    }
    // req.user is coming from auth
    const product = await productModel.create({
      name,
      description,
      price,
      category,
      brand,
      stock,
      productOwner: req.user.id,
      productOwnerEmail: req.user.userEmail,
    });
    res.status(201).json({ message: "Product create successfully", product });
  } catch (error) {
    res.status(402).json("Error :", error.message);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await productModel.find(filter).sort({ updatedAt: -1 });
    if (!products) {
      return res.status(402).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const Product = await productModel.findById(productID);
    if (!Product) {
      res.status(402).json({ message: "No product found" });
    }
    res.status(201).json(Product);
  } catch (error) {
    res.status(402).json("Error :", error.message);
  }
};

module.exports = { createProduct, getProducts, getSingleProduct };
