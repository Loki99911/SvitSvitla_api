const { HttpError, ctrlWrapper } = require("../helpers");
const { Review } = require("../models/review");

const addReview = async (req, res) => {
  const { _id: owner } = req.user;
  const answer = await Review.create({ ...req.body, owner });
  res.status(201).json(answer);
};

module.exports = {
  addReview: ctrlWrapper(addReview),
};
