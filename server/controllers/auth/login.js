const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
      };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res
        .status(200)
        .json({
          token: jwtToken,
          user: { id: user._id, name: user.name, email: user.email },
        });
    }
    return res.status(400).json({ message: "Invalid email or password" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

module.exports = login;
