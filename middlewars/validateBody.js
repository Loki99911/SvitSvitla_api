const { json } = require("body-parser");
const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    req.body.additionalAttributes = JSON.parse(req.body.additionalAttributes);
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = validateBody;
