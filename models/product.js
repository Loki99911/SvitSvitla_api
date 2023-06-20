const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const PRODUCT_IMG_PARAMS = {
  dimensions: {
    width: 473,
  },
  maxFileSize: 100000,
  acceptableFileTypes: ["jpg", "jpeg", "png"],
};

const priceValidation = /^\d+(\.\d{1,2})?$/;        

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
  productCountry: {
    type: String,
    required: [true, "Set manufacturer country for product"],
  },
  productCoverURL: {
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
  productPrice: Joi.string()
    .messages({ "any.required": "missing field - productPrice" })
    .pattern(priceValidation)
    .required(),
  productCountry: Joi.string()
    .messages({ "any.required": "missing field - productCountry" })
    .required(),
  productCoverURL: Joi.any(),
  productPhotoURL: Joi.array().items(Joi.string()),
  additionalAttributes: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      value: Joi.string(),
    })
  ),
});

const Product = model("product", productSchema);

module.exports = { Product, schemaJoi, PRODUCT_IMG_PARAMS };
