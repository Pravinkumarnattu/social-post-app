const bycrypt = require("bcrypt");
const User = require("../../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const heashedPassword = await bycrypt.hash(password, 10);
    const user = await User.create({ name, email, password: heashedPassword });
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

module.exports = register;
