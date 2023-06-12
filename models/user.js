const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { mongooseHandleError } = require("../helpers");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    login: {
      type: String,
      required: [true, "Login is required"],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseHandleError);

const loginSchemaJoi = Joi.object({
  password: Joi.string()
    .messages({ "any.required": "Missing field - password" })
    .required(),
  login: Joi.string()
    .messages({ "any.required": "Missing field - login" })
    .required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  loginSchemaJoi,
};
