require("express-async-errors");
const getUserById = require("../utils/getUserById");
const getClassById = require("../utils/getClassById");
const UserClass = require("./UserClassModal");
const validateCustomObject = require("../middleware/validateCustomObject");
const { globalRoles } = require("../utils/roles");

exports.createClass = async (req, res) => {
  validateCustomObject(req.body, ["name"]);

  const existingClass = await UserClass.find({ name: req.body.name });
  if (existingClass.length > 0)
    return res
      .status(400)
      .json({ msg: "class with the given name already exists" });

  let users = [],
    invalidUsers = [];
  if (req.body.users && req.body.users.length > 0) {
    for (let i = 0; i < req.body.users.length; i++) {
      let user = await getUserById(res, req.body.users[i]);
      if (globalRoles.includes(user.role)) {
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
      name: userClass.name,
      _id: userClass._id,
      users,
      ...(invalidUsers.length > 0 ? { invalidUsers } : null),
    });
  } else {
    let userClass = new UserClass({
      name: req.body.name,
      users: [],
    });
    await userClass.save();
    return res.status(200).json({
      msg: "Class Created",
      _id: userClass._id,
      name: userClass.name,
      users: [],
    });
  }
};

exports.enrollUsers = async (req, res) => {
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
        if (globalRoles.includes(currentUser.role)) {
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
      className: userClass.name,
      _id: userClass._id,
      users,
      existingUsers,
      invalidUsers,
    });
  }
};

exports.removeUsersFromClass = async (req, res) => {
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
    className: userClass.name,
    _id: userClass._id,
    users: removedUsers,
    invalidUsers,
  });
};

exports.updateClass = async (req, res) => {
  if (!req.params.classId)
    return res.status(400).json({ msg: "Please do provide a classId" });
  validateCustomObject(req.body, ["name"]);

  let userClass = await getClassById(res, req.params.classId);
  if (!userClass) return res.send(404).json({ msg: "Class Not found" });

  userClass.name = req.body.name;
  res.json({
    userClass,
  });

  return userClass.save();
};

exports.deleteClass = async (req, res) => {
  if (!req.params.classId)
    return res.status(400).json({ msg: "Please do provide a classId" });

  let userClass = await UserClass.findByIdAndRemove(req.params.classId);
  if (!userClass) return res.send(404).json({ msg: "Class Not found" });

  return res.json({
    msg: "class deleted",
    userClass,
  });
};
