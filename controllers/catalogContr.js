const { HttpError, ctrlWrapper } = require("../helpers");
const { Catalog } = require("../models/catalog");

const listCatalogs = async (req, res) => {
  // const { _id: owner} = req.user;
  // // --- pagination&filtration ---
  // const { page = 1, limit = 8, favorite } = req.params;
  // const skip = (page - 1) * limit;

  // const answer = await Catalog.find(
  //   favorite ? { owner, favorite } : { owner },
  //   "-__v",
  //   { skip, limit }
  // );
  // res.json(answer);
  const answer = await Catalog;
  res.json(answer);
};

const addCatalog = async (req, res) => {
  const { _id: owner } = req.user;
  const answer = await Product.create({ ...req.body, owner });
  res.status(201).json(answer);
};

const removeCatalog = async (req, res) => {
  const { _id: owner } = req.user;
  const { productId } = req.params;
  const answer = await Product.findOneAndRemove({ _id: productId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "Product deleted" });
};

const updateCatalog = async (req, res) => {
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
  listCatalogs: ctrlWrapper(listCatalogs),
  addCatalog: ctrlWrapper(addCatalog),
  removeCatalog: ctrlWrapper(removeCatalog),
  updateCatalog: ctrlWrapper(updateCatalog),
};
