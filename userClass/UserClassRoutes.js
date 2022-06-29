const express = require("express");
const UserClass = require("./UserClassModal");
const isAdmin = require("../middleware/isAdmin");
const globalRoute = require("../middleware/globalRoutes");
const getUserById = require("../utilis/getUserById");
const getClassById = require("../utilis/getClassById");
const route = express.Router();

// created a course returns valid and invalid users (do create class if have errors with the users but should be unique)
route.post("/", isAdmin, async (req, res) => {
  try {
    const existingClass = await UserClass.find({ name: req.body.name });
    if (existingClass.length > 0)
      return res
        .status(400)
        .json({ msg: "class with the given name already exists" });

    let users = [],
      invalidUsers = [];
    if (req.body.users.length > 0) {
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
          _id: userClass._id,
          users,
          ...(invalidUsers.length > 0 ? { invalidUsers } : null),
        },
      });
    } else {
      let userClass = new UserClass({
        name: req.body.name,
        users: users,
      });
      await userClass.save();
      return res.status(200).json({
        msg: "Class Created",
        data: {
          _id: userClass._id,
          name: userClass.name,
          users: [],
        },
      });
    }
  } catch (ex) {
    return res.status(500).json({ msg: "Server Error" });
  }
});
// enroll users in class (using class id)
route.post("/:classId/enroll-users", globalRoute, async (req, res) => {
  try {
    if (!req.params.classId)
      return res.status(400).json({ msg: "Please do provide a classId" });

    if (req.body.users.length == 0)
      return res.status(400).json({ msg: "Invalid Users" });

    let userClass = await getClassById(res, req.params.classId);

    let existingUsers = [],
      invalidUsers = [];
    if (userClass.users == 0) {
      let u = [];
      for (let i = 0; i < req.body.users.length; i++) {
        let currentUser = await getUserById(res, req.body.users[i]);
        if (["admin", "teacher"].includes(currentUser.role)) {
          invalidUsers.push(user);
        } else {
          u.push(currentUser);
        }
      }
      userClass.users = u;
      await userClass.save();
      let Class = {
        _id: userClass._id,
        name: userClass.name,
        users: u,
        invalidUsers,
      };
      return res
        .status(200)
        .json({ msg: "Users enrolled in class", class: Class });
    } else {
      let users = [];
      for (let j = 0; j < req.body.users.length; j++) {
        if (userClass.users.includes(req.body.users[j])) {
          existingUsers.push(await getUserById(res, req.body.users[j]));
        } else {
          let currentUser = await getUserById(res, req.body.users[j]);
          if (["admin", "teacher"].includes(currentUser.role)) {
            invalidUsers.push(currentUser);
          } else {
            users.push(currentUser);
          }
        }
      }

      userClass.users = [...userClass.users, ...users];
      await userClass.save();
      return res.json({
        msg: "Users Enrolled",
        data: {
          className: userClass.name,
          _id: userClass._id,
          users,
          existingUsers,
          invalidUsers,
        },
      });
    }
  } catch (ex) {
    console.log(ex);
    if (ex.kind === "ObjectId")
      return res.status(400).json({ msg: "Invalid userId" });

    return res.status(500).json({ msg: "Internal Server Error", error: ex });
  }
});
// remove user from course (using user id) (can be multiple or single users)
route.post("/:classId/remove-users", globalRoute, async (req, res) => {
  try {
    if (!req.params.classId)
      return res.status(400).json({ msg: "Please do provide a classId" });

    if (req.body.users.length == 0)
      return res.status(400).json({ msg: "Invalid Users" });

    let userClass = await getClassById(res, req.params.classId);
    let invalidUsers = [],
      removedUsers = [];

    for (let i = 0; i < req.body.users.length; i++) {
      let currentUser = await getUserById(res, req.body.users[i]);
      if (!userClass.users.includes(req.body.users[i])) {
        invalidUsers.push(currentUser);
      } else {
        let index = userClass.users.indexOf(req.body.users[i]);
        userClass.users.splice(index, 1);
        removedUsers.push(currentUser);
      }
    }
    await userClass.save();
    return res.json({
      msg: "Users Removed from class",
      data: {
        className: userClass.name,
        _id: userClass._id,
        users: removedUsers,
        invalidUsers,
      },
    });
  } catch (ex) {
    if (ex.kind === "ObjectId")
      return res.status(400).json({ msg: "Invalid userId" });

    return res.status(500).json({ msg: "Internal Server Error", error: ex });
  }
});

module.exports = route;
