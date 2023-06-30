const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/productsContr");
const { validateBody, isValidIdProduct, uploadCloudProduct, uploadCloudPhoto } = require("../../middlewars");
const { schemaJoi } = require("../../models/product");

router.get("/", ctrl.listProducts);

router.get("/:productId", isValidIdProduct, ctrl.getProductById);

router.post(
  "/",
  uploadCloudProduct,
  validateBody(schemaJoi),
  ctrl.addProduct
);

router.delete("/:productId", isValidIdProduct, ctrl.removeProduct);

router.put(
  "/:productId",
  isValidIdProduct,
  uploadCloudProduct,
  validateBody(schemaJoi),
  ctrl.updateProduct
);

module.exports = router;
