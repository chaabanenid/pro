const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({ msg: "You are not authorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(400).json({ msg: "You are not authorized" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
module.exports = verifyToken;
