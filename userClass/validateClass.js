const Joi = require("joi");

module.exports = (userClass) => {
  const JoiSchema = Joi.object({
    name: Joi.string().min(5).max(30).required(),
    users: Joi.string(),
  }).options({ abortEarly: false });

  return JoiSchema.validate(userClass);
};
