const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getSingleProduct,
} = require("../controllers/productController");

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

module.exports = router;
