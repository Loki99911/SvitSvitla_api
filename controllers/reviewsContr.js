const { HttpError, ctrlWrapper } = require("../helpers");
const { Review } = require("../models/review");

const addReview = async (req, res) => {
  const lastDate = Date.now();
  console.log({ ...req.body, lastDate: lastDate });
  console.log(lastDate);
  const answer = await Review.create({ ...req.body, lastDate: lastDate });
  res.status(201).json(answer);
};

module.exports = {
  addReview: ctrlWrapper(addReview),
};
