const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidIdProduct = (req, res, next) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    next(HttpError(404, `'${productId}' not valid id format`));
  }
  next();
};

module.exports = isValidIdProduct;
