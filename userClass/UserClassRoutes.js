const express = require("express");
const UserClass = require("./UserClassModal");
const isAdmin = require("../middleware/isAdmin");
const getUserById = require("../utilis/getUserById");
const route = express.Router();

// created a course returns valid and invalid users (do create class if have errors with the users but should be unique)
route.post("/class", isAdmin, async (req, res) => {
  try {
    const existingClass = await UserClass.find({ name: req.body.name });
    if (existingClass)
      return res.status(400).json({ msg: "class with the given name exists" });

    let users = [],
      invalidUsers = [];
    if (req.body.users) {
      for (let i = 0; i < req.body.users.length; i++) {
        let user = await getUserById(res, req.body.users[i]);
        if (["admin", "teacher"].includes(user.role)) {
          invalidUsers.push(user);
        } else {
          users.push(user);
        }
      }
      let userClass = new UserClass({
        name: req.body.name,
        users: users,
      });
      await userClass.save();
      return res.status(200).json({
        msg: "Course Created",
        ...(invalidUsers.length > 0 ? { error: "Invalid users" } : null),
        data: {
          name: userClass.name,
          users,
          ...(invalidUsers.length > 0 ? { invalidUsers: invalidUsers } : null),
        },
      });
    }
  } catch (ex) {
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = route;
