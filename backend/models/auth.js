const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  // ❌ No token sent
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  // ✅ Extract token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "zimgrow_secret"
    );

    // ✅ Attach user ID to request
    req.userId = decoded.id;

    next(); // allow request
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
