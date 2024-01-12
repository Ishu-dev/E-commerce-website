import express from "express";
import {
  getProducts,
  getProductDetails,
  newProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);

router.route("/products/:id").get(getProductDetails);  //:id = placeholder of id
router.route("/products/:id").put(updateProduct);
router.route("/products/:id").delete(deleteProduct);

export default router;
