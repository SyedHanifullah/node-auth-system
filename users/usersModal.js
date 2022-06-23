const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    default: null,
  },
});
userSchema.methods.generateAuthToken = function () {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    _id: this._id,
    userRole: this.role,
  };

  return jwt.sign(data, jwtSecretKey);
};
const User = mongoose.model("User", userSchema);
module.exports = {User,userSchema};
 