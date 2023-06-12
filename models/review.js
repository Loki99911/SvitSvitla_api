const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const reviewSchema = new Schema({
  reviewMark: {
    type: Number,
    required: [true, "Set mark"],
  },
  reviewText: {
    type: String,
    required: [true, "Set review"],
  },
  negativeFeed: {
    type: String,
  },
});

reviewSchema.post("save", mongooseHandleError);

const reviewSchemaJoi = Joi.object({
  reviewMark: Joi.number()
    .messages({ "any.required": "missing field - reviewMark" })
    .required(),
  reviewText: Joi.string()
    .messages({ "any.required": "missing field - reviewText" })
    .required(),
  negativeFeed: Joi.string(),
});

const Review = model("review", reviewSchema);

module.exports = { Review, reviewSchemaJoi}; 
