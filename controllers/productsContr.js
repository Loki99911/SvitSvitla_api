const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/product");

const listProducts = async (req, res) => {
  // --- pagination ---
  const { page = 1, limit = 8, article } = req.query;
  const skip = (page - 1) * limit;

  const answer = await Product.find(
    article ? { productCode: article } : {},
    "-__v",
    {
      skip,
      limit,
    }
  );

  const count = await Product.find({});
  res.json({ data: answer, total: count.length });
};

const getProductById = async (req, res) => {
  const { productId } = req.params;
  const answer = await Product.findOne({ _id: productId });
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const addProduct = async (req, res) => {
  const answer = await Product.create({ ...req.body });
  res.status(201).json(answer);
};

const removeProduct = async (req, res) => {
  const { productId } = req.params;
  const answer = await Product.findOneAndRemove({ _id: productId });
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "Product deleted", ...answer });
};

const updateProduct = async (req, res) => {
  console.log("CORTO START");
  const { productId } = req.params;
  const answer = await Product.findOneAndUpdate({ _id: productId }, req.body);
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

module.exports = {
  listProducts: ctrlWrapper(listProducts),
  getProductById: ctrlWrapper(getProductById),
  removeProduct: ctrlWrapper(removeProduct),
  addProduct: ctrlWrapper(addProduct),
  updateProduct: ctrlWrapper(updateProduct),
};
