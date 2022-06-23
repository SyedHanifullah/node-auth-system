const mongoose = require("mongoose");
const userSchema = require("../users/usersModal");
const userClassSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: null,
  },
});

const UserClass = mongoose.model("UserClass", userClassSchema);
module.exports = UserClass;
