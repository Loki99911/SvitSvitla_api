const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/catalogContr");
const { validateBody, isValidId, uploadCloudCatalog, uploadCloudCover } = require("../../middlewars");
const { catalogSchemaJoi } = require("../../models/user");

router.get("/", ctrl.listCatalogs);
router.post("/",uploadCloudCatalog, validateBody(catalogSchemaJoi), ctrl.addCatalog);
router.delete("/:catalogId", isValidId, ctrl.removeCatalog);
router.put(
  "/:catalogId",
  isValidId,
  uploadCloudCover,
  uploadCloudCatalog,
  validateBody(catalogSchemaJoi),
  ctrl.updateCatalog
);
module.exports = router;
