const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const globalRoute = require("../middleware/globalRoutes");
const {
  createClass,
  enrollUsers,
  removeUsersFromClass,
  updateClass,
  deleteClass
} = require("./classControllers");
const route = express.Router();

// created a course returns valid and invalid users (do create class if have errors with the users but should be unique)
route.post("/", isAdmin, createClass);

// enroll users in class (using class id)
route.post("/:classId/enroll-users", globalRoute, enrollUsers);

// remove user from course (using user id) (can be multiple or single users)
route.post("/:classId/remove-users", globalRoute, removeUsersFromClass);

//updates class
route.patch("/:classId", globalRoute, updateClass);

//delete class
route.delete("/:classId", globalRoute, deleteClass);


module.exports = route;
