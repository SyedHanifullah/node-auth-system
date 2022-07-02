const { User } = require("./usersModal");
const validateUser = require("./validateUser");
const {roles} = require("../utils/roles");
const validateCustomObject = require("../middleware/validateCustomObject");

exports.getAllUsers = async (req, res) => {
  const user = await User.find().select("-password");
  return res.json({ user });
};

exports.getActiveUser = async (req, res) => {
  const user = await User.findById(req._id).select("-password");

  if (!user) return res.status(404).json({ msg: "User Not Found" });

  return res.status(200).json({
    msg: "Active User",
    user,
  });
};

exports.createNewUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ msg: error.details[0]?.message });

  if (!roles.includes(role))
    return res.status(400).json({
      msg: `user role must be of either values ${role}`,
    });

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User Already Exists" });

  user = new User({
    name,
    email,
    role,
    password,
  });
  let token = user.generateAuthToken();
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
  });
  user = await user.save();
};

exports.updateUserPassword = async (req, res) => {
  validateCustomObject(req.body, [
    "currentPassword",
    "newPassword",
    "newPasswordConfirmed",
  ]);
  const { currentPassword, newPassword, newPasswordConfirmed } = req.body;

  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (user.password != currentPassword)
    return res.status(400).json({ msg: "Please enter your valid Password" });

  if (newPassword != newPasswordConfirmed)
    return res.status(400).json({ msg: "Passwords Should match" });

  user.password = newPassword;
  await user.save();

  res.json({ msg: "Password Updated Successfully" });
};

exports.updateUser = async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });

  validateCustomObject(req.body, ["name", "email"]);
  const user = await User.findById(req.params.userId).select("-password");
  if (!user) return res.status(400).json({ msg: "User not found" });

  const { name, email, role } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.role = role || user.role;
  await user.save();

  res.json({
    msg: "user Updated",
    user,
  });
};

exports.deleteUser = async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });
  const user = await User.findByIdAndRemove(req.params.userId);
  if (!user) return res.status(400).json({ msg: "User not found" });

  res.json({ msg: "User delete successfully", user });
};

exports.updateUserPasswordByAdmin = async (req, res) => {
  validateCustomObject(req.body, ["newPassword", "newPasswordConfirmed"]);

  const { newPassword, newPasswordConfirmed } = req.body;

  if (!req.params.userId)
    return res.status(400).json({ msg: "Please do provide a valid userId" });

  const user = await User.findById(req.params.userId);
  if (!user) return res.status(400).json({ msg: "User not found" });

  if (newPassword != newPasswordConfirmed)
    return res.status(400).json({ msg: "Passwords Should match" });

  user.password = newPassword;
  await user.save();

  res.json({ msg: "Password Updated Successfully" });
};

exports.getSingleUser = async (req, res) => {
  if (!req.params.userId)
    return res.status(404).json({ msg: "Please do provide User" });

  const user = await User.findOne({ _id: req.params.userId }).select(
    "-password"
  );
  if (!user) res.status(404).json({ msg: "No User Found" });

  return res.status(200).json({ msg: "single user", user });
};
