const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const upload = require("./upload");
const {
  uploadCloudProduct,
  uploadCloudCatalog,
} = require("./uploadCloudinary");


module.exports = {
  validateBody,
  isValidId,
  authenticate,
  upload,
  uploadCloudProduct,
  uploadCloudCatalog,
};
