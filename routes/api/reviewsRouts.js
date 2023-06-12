const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/reviewsContr");
const { validateBody} = require("../../middlewars");
const { schemaJoi } = require("../../models/product");

router.post("/", validateBody(schemaJoi), ctrl.addReview);

module.exports = router;
