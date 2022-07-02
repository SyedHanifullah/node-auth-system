module.exports = (data, validator = []) => {
  for (let i = 0; i < validator.length; i++) {
    if (!data.hasOwnProperty(validator[i]))
      throw {
        msg: `${validator[i]} is required`,
      };
  }

  return;
};
