const Joi = require("joi");

module.exports = (user) => {
  const JoiSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(5).max(255).required(),
    role: Joi.string().required(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
};
