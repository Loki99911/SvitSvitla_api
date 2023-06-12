const { HttpError, ctrlWrapper } = require("../helpers");
const { Product } = require("../models/product");

const listProducts = async (req, res) => {
  // const { _id: owner} = req.user;
  // // --- pagination&filtration ---
  // const { page = 1, limit = 8, favorite } = req.params;
  // const skip = (page - 1) * limit;

  // const answer = await Product.find(
  //   favorite ? { owner, favorite } : { owner },
  //   "-__v",
  //   { skip, limit }
  // );
  // res.json(answer);
  const answer = await Product;
  res.json(answer);
};

const getProductById = async (req, res) => {
  const { _id: owner } = req.user;
  const { productId } = req.params;
  const answer = await Product.findOne({ _id: productId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json(answer);
};

const addProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const answer = await Product.create({ ...req.body, owner });
  res.status(201).json(answer);
};

const removeProduct = async (req, res) => {
  const { _id: owner } = req.user;
  const { productId } = req.params;
  const answer = await Product.findOneAndRemove({ _id: productId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "Product deleted" });
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { _id: owner } = req.user;
  const answer = await Product.findOneAndUpdate(
    { _id: productId, owner },
    req.body,
    {
      new: true,
    }
  );
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
