const express = require("express");
const User = require("./usersModal");
const validateUser = require("./validateUser");
const authToken = require("../middleware/authToken");
const globalRoutes = require("../middleware/globalRoutes");
const isAdmin = require("../middleware/isAdmin");
const isTeacher = require("../middleware/isTeacher");
const isStudent = require("../middleware/isStudent");
const passwordMailer = require("../utilis/PasswordMail");
const route = express.Router();

route.get("/", [authToken, globalRoutes], async (req, res) => {
  try {
    // passwordMailer();
    const user = await User.find().select("-password");
    return res.json({ data: user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});
route.get("/active", authToken, async (req, res) => {
  try {
    const user = await User.findById(req._id).select("-password");

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    return res.status(200).json({
      msg: "Active User",
      data: user,
    });
  } catch (ex) {
    res.status(500).json({ msg: ex });
  }
}); 
// creating new user
route.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0]?.message);
    
    if(!["student","teacher","admin"].includes(role))return res.status(400).json({ msg: "user role must be of either values (admin, teacher, admin)" });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User Already Exists");

    user = new User({
      name,
      email,
      role,
      password
    });
    res.header("x-auth-token", user.generateAuthToken()).status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    user = await user.save();
  } catch (ex) {
    res.status(500).send("Internal Server Error");
    console.log(ex);
  }
});
route.post("/:userId/password", [authToken, globalRoutes], async (req, res) => {
  const { currentPassword, newPassword, newPasswordConfirmed } = req.body;

  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.password != currentPassword)
      return res
        .status(400)
        .json({ msg: "Please enter your valid currentPassword" });

    if (newPassword != newPasswordConfirmed)
      return res.status(400).json({ msg: "Passwords Should match" });

    user.password = newPassword;

    await user.save();

    res.json({ msg: "Password Updated Successfully" });
  } catch (ex) {
    if (ex.kind === "ObjectId")
      return res.status(400).json({ msg: "Invalid userId" });

    res.status(500).json({ msg: "Internal Serer Error" });
  }
});
route.patch("/:userId", [authToken, globalRoutes], async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });

  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(400).json({ msg: "User not found" });

    const { name, email, role } = req.body;
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.role = role ? role : user.role;
    await user.save();

    res.json({
      msg: "Updated",
      data: user,
    });
  } catch (ex) {
    if (ex.kind === "ObjectId")
      return res.status(400).json({ msg: "Invalid userId" });

    res.status(500).json({ msg: "Internal Server Error" });
  }
});
route.delete("/:userId", [authToken, isAdmin], async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });
  try {
    const user = await User.findByIdAndRemove(req.params.userId);
    if (!user) return res.status(400).json({ msg: "User not found" });

    res.json({ msg: "User delete successfully", user });
  } catch (ex) {
    if (ex.kind === "ObjectId")
      return res.status(400).json({ msg: "Invalid userId" });

    res.status(500).json({ msg: "Internal Serer Error" });
  }
});

module.exports = route;
