const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    //validate the user details
    validateSignUpData(req);
    //password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(401).send("Error " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordVaild = await user.validatePassword(password); //returns boolean
    if (isPasswordVaild) {
      //creating jwt token

      const token = await user.getJWT(); //Here who ever the current user it will generate token for that user by userShema
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(401).send(err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful!");
});
module.exports = authRouter;
