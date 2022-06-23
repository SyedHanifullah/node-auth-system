const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authToken = require("./middleware/authToken");
const user = require("./users/usersRoutes");
const userAuth = require("./users/UserAuth");
const userClass = require("./userClass/UserClassRoutes");
// const fileUpload = require("./fileUpload/fileUpload");
const path = require("path");

const app = express();
dotenv.config();
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
mongoose
  .connect("mongodb://localhost/abcSchool")
  .then(() => console.log("Connected to mongodb"))
  .catch((ex) => console.log(ex));
app.use("/api/users", user);
app.use("/api/auth/login", userAuth);
app.use("/api/users", userClass);

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
