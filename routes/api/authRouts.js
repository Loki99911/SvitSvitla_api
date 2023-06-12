const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/authContr");
const { validateBody, authenticate} = require("../../middlewars");
const {
  loginSchemaJoi,
} = require("../../models/user");

router.post("/login", validateBody(loginSchemaJoi), ctrl.login);
router.get("/logout", authenticate, ctrl.logout);

module.exports = router;
