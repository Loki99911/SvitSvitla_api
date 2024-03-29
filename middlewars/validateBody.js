const { json } = require("body-parser");
const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    console.log("---validateBody", req.body);
    if (req.body.additionalAttributes) {
      req.body.additionalAttributes = JSON.parse(req.body.additionalAttributes);
    }
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
