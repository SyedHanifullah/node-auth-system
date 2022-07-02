const express = require("express");
require("express-async-errors");
const authToken = require("../middleware/authToken");
const globalRoutes = require("../middleware/globalRoutes");
const isAdmin = require("../middleware/isAdmin");
const {
  getAllUsers,
  getActiveUser,
  createNewUser,
  updateUserPassword,
  updateUser,
  updateUserPasswordByAdmin,
  deleteUser,getSingleUser
} = require("./userController");
const route = express.Router();

// get all users
route.get("/", [authToken, globalRoutes], getAllUsers);
// get active user
route.get("/active", authToken, getActiveUser);
// creating new user
route.post("/", createNewUser);
//  update user password (every user can)
route.post("/:userId/password", [authToken], updateUserPassword);
//updates a users (teacher/admin) (not password)
route.patch("/:userId", [authToken, globalRoutes], updateUser);
// deletes a user only for admin
route.delete("/:userId", [authToken, isAdmin], deleteUser);
// get single user
route.get(":/userId",[authToken,globalRoutes],getSingleUser)
// updates user password (if old password isnt provided) (only for admin)
route.post(
  "/:userId/new-password",
  [authToken, isAdmin],
  updateUserPasswordByAdmin
);

module.exports = route;
