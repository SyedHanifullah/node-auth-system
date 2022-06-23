const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  if (!req.headers || !req.headers["x-auth-token"])
    return res.status(401).json({ msg: "Unauthorized" });

  const token = jwt.verify(
    req.headers["x-auth-token"],
    process.env.JWT_SECRET_KEY
  );
  if (!token) return res.status(400).json({ msg: "Invalid Token" });

  let { userRole: role } = token;

  if (role === "admin" || role === "teacher") {
    next();
  } else {
    res.status(401).json({ msg: " Not an admin user, Unauthorized " });
  }
};
