module.exports = (ex, req, res, next) => {
  if (ex.kind === "ObjectId")
    return res.status(400).json({ msg: "Invalid Id format" });

  res.status(500).json({ msg: "Internal server Error", error: ex });
};



