const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const users = require("./users/usersRoutes");
const userAuth = require("./users/UserAuth");
const userClass = require("./userClass/UserClassRoutes");
const error = require("./middleware/error");
const app = express();
dotenv.config();
app.use(express.json());
app.set("view engine", "ejs");
mongoose
  .connect("mongodb://localhost/abcSchool")
  .then(() => console.log("Connected to mongodb"))
  .catch((ex) => console.log(ex));

app.use("/api/users", users); 
app.use("/api/auth/login", userAuth);  // login
app.use("/api/class", userClass); 
app.use(error);

app.listen(7000, () => {
  console.log("Server is running on Port 7000");
});
