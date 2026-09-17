const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

// Cookie configuration options for cross-origin authentication
const COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 8 * 3600000), // 8 hours
  httpOnly: true,
  secure: true,      // Required for HTTPS cross-origin setup
  sameSite: "none",  // Required for cross-origin cookie passing
};

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, COOKIE_OPTIONS);
      res.json({ message: "Login successful", user });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  // Must match sameSite and secure settings to clear cross-origin cookie properly
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.json({ message: "Logout successful!" });
});

module.exports = authRouter;