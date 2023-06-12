const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const catalogSchema = new Schema({
  catalogName: {
    type: String,
    required: [true, "Set name for catalog"],
  },
  catalogYear: {
    type: String,
    required: [true, "Set catalog year"],
  },
  catalogCoverURL: {
    type: String,
  },
  catalogFileURL: {
    type: String,
    required: [true, "Add catalog file"],
  },
});

catalogSchema.post("save", mongooseHandleError);

const catalogSchemaJoi = Joi.object({
  catalogName: Joi.string()
    .messages({ "any.required": "missing field - catalogName" })
    .required(),
  catalogYear: Joi.string()
    .messages({ "any.required": "missing field - catalogYear" })
    .required(),
  catalogCoverURL: Joi.number(),
  catalogFileURL: Joi.string()
    .messages({ "any.required": "missing field - catalogFile" })
    .required(),
});

const Catalog = model("catalog", catalogSchema);

module.exports = { Catalog, catalogSchemaJoi };
