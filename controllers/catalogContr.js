const { HttpError, ctrlWrapper } = require("../helpers");
const { Catalog } = require("../models/catalog");

const listCatalogs = async (req, res) => {
  // --- pagination ---
  const { page = 1, limit = 8 } = req.query;
  const skip = (page - 1) * limit;

  const answer = await Catalog.find({}, "-__v", { skip, limit });
  res.json(answer);
};

const addCatalog = async (req, res) => {
  const answer = await Catalog.create({ ...req.body });
  res.status(201).json(answer);
};

const removeCatalog = async (req, res) => {
  const { _id: owner } = req.user;
  const { catalogId } = req.params;
  const answer = await Catalog.findOneAndRemove({ _id: catalogId, owner });
  if (!answer) {
    throw HttpError(404);
  }
  res.json({ message: "Catalog deleted" });
};

const updateCatalog = async (req, res) => {
  const { catalogId } = req.params;
  const { _id: owner } = req.user;
  const answer = await Catalog.findOneAndUpdate(
    { _id: catalogId, owner },
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
