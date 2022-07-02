const UserClass = require("../userClass/UserClassModal");
module.exports = async (res, classId) => {
  try {
     const userClass = await UserClass.findOne({ _id: classId });
     if (!userClass)
      res.status(404).json({ msg: "class with given id not found" });

    return userClass;
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format", error: err });

    return res.status(500).json({ msg: "Internal Server Error", error: err });
  }
};
