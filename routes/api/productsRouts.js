const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/productsContr");
const { validateBody, isValidId, uploadCloudCover, uploadCloudPhoto } = require("../../middlewars");
const { schemaJoi } = require("../../models/product");

router.get("/", ctrl.listProducts);

router.get("/:productId", isValidId, ctrl.getProductById);

router.post(
  "/",
  uploadCloudCover,
  uploadCloudPhoto,
  validateBody(schemaJoi),
  ctrl.addProduct
);

router.delete("/:productId", isValidId, ctrl.removeProduct);

router.put(
  "/:productId",
  isValidId,
  uploadCloudCover,
  uploadCloudPhoto,
  validateBody(schemaJoi),
  ctrl.updateProduct
);

module.exports = router;
