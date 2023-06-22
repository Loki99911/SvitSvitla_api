const { HttpError, ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { login, password } = req.body;
    // const hashPassword = await bcrypt.hash(password, 10);
    // console.log(hashPassword);
  const user = await User.findOne({ login });

  if (!user) {
    throw HttpError(401, "Login or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Login or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    user: user.login,
    id: user._id,
    accessToken: token,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json({});
};

module.exports = {
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
