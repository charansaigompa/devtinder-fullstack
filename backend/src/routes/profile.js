const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const { upload } = require("../middleware/multer");
const uploadOnCloudinary = require("../utils/cloudinary");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("photoUrl"),
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit");
      }
      if (req.body.skills) {
        req.body.skills = JSON.parse(req.body.skills);
      }

      if (req.body.skills && req.body.skills.length > 10) {
        throw new Error("Max 10 skills are allowed");
      }

      const loggedInUser = req.user;

      // Update normal fields
      Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
      });

      // Upload image and update photoUrl
      if (req.file) {
        const imageUrl = await uploadOnCloudinary(req.file.path);
        loggedInUser.photoUrl = imageUrl;
      }

      await loggedInUser.save();

      res.json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName}, your profile is updated`,
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  },
);

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isPasswordVaild = await user.validatePassword(req.body.oldPassword);
    if (!isPasswordVaild) {
      throw new Error("Invalid credentials");
    }
    const newPassword = req.body.newPassword;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    await user.save();
    res.clearCookie("token");
    res.send("password updated");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

module.exports = profileRouter;
