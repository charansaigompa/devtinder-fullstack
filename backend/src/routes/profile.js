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

// Function wrapper to catch Multer file parsing errors gracefully
const handleUpload = (req, res, next) => {
  upload.single("photoUrl")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error: " + err.message });
    }
    next();
  });
};

profileRouter.patch(
  "/profile/edit",
  userAuth,
  handleUpload, // Use safe upload middleware
  async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit");
      }

      if (req.body.skills && typeof req.body.skills === "string") {
        req.body.skills = JSON.parse(req.body.skills);
      }

      if (req.body.skills && req.body.skills.length > 10) {
        throw new Error("Max 10 skills are allowed");
      }

      const loggedInUser = req.user;

      // Avoid overwriting fields with undefined or file objects
      Object.keys(req.body).forEach((key) => {
        if (key !== "photoUrl") {
          loggedInUser[key] = req.body[key];
        }
      });

      // Upload image to Cloudinary if file exists
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
      res.status(400).json({ error: err.message });
    }
  }
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
