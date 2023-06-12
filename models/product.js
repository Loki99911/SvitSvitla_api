const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const PORDUCT_IMG_PARAMS = {
  dimensions: {
    width: 473,
  },
  maxFileSize: 100000,
  acceptableFileTypes: ["jpg", "jpeg", "png"],
};

const priceValidation = /^\d+(\.\d{2})?$/;

const productSchema = new Schema({
  productName: {
    type: String,
    required: [true, "Set name for product"],
  },
  productCode: {
    type: String,
    required: [true, "Set vendor code for product"],
  },
  productPrice: {
    type: Number,
    match: priceValidation,
    required: [true, "Set price for product"],
  },
  productСoverURL: {
    type: String,
  },
  productPhotoURL: [
    {
      type: String,
    },
  ],
  additionalAttributes: [
    {
      name: String,
      value: String,
    },
  ],
});

productSchema.post("save", mongooseHandleError);

const schemaJoi = Joi.object({
  productName: Joi.string()
    .messages({ "any.required": "missing field - productName" })
    .required(),
  productCode: Joi.string()
    .messages({ "any.required": "missing field - productCode" })
    .required(),
  productPrice: Joi.number()
    .messages({ "any.required": "missing field - productPrice" })
    // .pattern(priceValidation)
    .required(),
  productCoverURL: Joi.string(),
  productPhotoURL: Joi.string(),
  additionalAttributes: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      value: Joi.string(),
    })
  ),
});

const Product = model("product", productSchema);

module.exports = { Product, schemaJoi, PORDUCT_IMG_PARAMS };
