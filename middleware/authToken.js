const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.headers["x-auth-token"])
    return res.status(401).json({ msg: "No token Provided" });

  try {
    let userDetails = jwt.verify(
      req.headers["x-auth-token"],
      process.env.JWT_SECRET_KEY
    );
    req._id = userDetails._id;
    next();
  } catch (e) {
    return res.status(400).json({msg:"Invalid Token"});
  }
};
