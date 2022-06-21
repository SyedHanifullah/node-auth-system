const express = require("express");
const User = require("./usersModal");
const route = express.Router();

route.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ msg: error.details[0]?.message });

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "User Not Found" });
    if (user.password != req.body.password)
      return res.status(400).json({ msg: "Invalid Email or Password" });

    let token = user.generateAuthToken();
    return res.json({
      msg: "User LoggedIn successfully",
      data: {
        email: user.email,
        token,
      },
    });
  } catch (ex) {
    res.status(500).send("Server Error");
  }
});

module.exports = route;

const validateUser = (user) => {
  const Joi = require("joi");
  const JoiSchema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
};
