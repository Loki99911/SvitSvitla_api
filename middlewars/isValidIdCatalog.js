const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidIdCatalog = (req, res, next) => {
  const { catalogId } = req.params;
  if (!isValidObjectId(catalogId)) {
    next(HttpError(404, `'${catalogId}' not valid id format`));
  }
  next();
};

module.exports = isValidIdCatalog;
