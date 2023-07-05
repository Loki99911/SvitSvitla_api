const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/reviewsContr");
const { validateBody} = require("../../middlewars");
const { reviewSchemaJoi } = require("../../models/review");

router.post("/", validateBody(reviewSchemaJoi), ctrl.addReview);

module.exports = router;
