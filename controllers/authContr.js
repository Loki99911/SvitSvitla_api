const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { login, password } = req.body;
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
    token: token,
    user: user.login,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(204).json({});
};

// const getCurrent = async (req, res) => {
//   const { email, subscription } = req.user;
//   res.json({
//     email,
//     subscription,
//   });
// };


module.exports = {
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  // getCurrent: ctrlWrapper(getCurrent),
};
