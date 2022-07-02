const mongoose = require("mongoose");
const userClassSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null,
    required: true,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: null,
  },
});

const UserClass = mongoose.model("UserClass", userClassSchema);
module.exports = UserClass;
