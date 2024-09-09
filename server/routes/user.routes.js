const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwtMiddleware");
const { handleProfilePicture } = require("../helpers/FileUploader");

router.post(
  "/:userId/change_profile_image",
  authenticateToken,
  handleProfilePicture
);

module.exports = router;
