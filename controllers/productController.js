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
    res.status(402).json(error);
  }
};

module.exports = { createProduct };
