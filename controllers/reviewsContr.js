const { HttpError, ctrlWrapper } = require("../helpers");
const { Review } = require("../models/review");

const addReview = async (req, res) => {
  const answer = await Review.create({ ...req.body});
  res.status(201).json(answer);
};

module.exports = {
  addReview: ctrlWrapper(addReview),
};
