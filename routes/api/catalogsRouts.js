const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/catalogContr");
const { validateBody, isValidIdCatalog, uploadCloudCatalog, uploadCloudCover } = require("../../middlewars");
const { catalogSchemaJoi } = require("../../models/catalog");


router.get("/", ctrl.listCatalogs);
router.post("/",uploadCloudCatalog, validateBody(catalogSchemaJoi), ctrl.addCatalog);
router.delete("/:catalogId", isValidIdCatalog, ctrl.removeCatalog);
router.put(
  "/:catalogId",
  isValidIdCatalog,
  uploadCloudCatalog,
  validateBody(catalogSchemaJoi),
  ctrl.updateCatalog
);
module.exports = router;
