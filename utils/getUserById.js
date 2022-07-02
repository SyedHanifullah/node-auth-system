const { User } = require("../users/usersModal");
module.exports = async (res, userId) => {
  try {
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) res.status(404).json({ msg: "No User Found" }); 

    return user;
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};
