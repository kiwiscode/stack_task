const cloudinary = require("./Cloudinary");
const User = require("../models/User.model");

const handleProfilePicture = async (req, res) => {
  try {
    const { image } = req.body;

    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errorMessage: "USER NOT FOUND!" });
    }

    if (image) {
      const imageInfo = await cloudinary.uploader.upload(image, {
        folder: "Stack Task",
        quality: 100,
        format: "auto",
        gravity: "auto",
        width: 120,
        height: 120,
        crop: "fill",
        radius: "max",
        allowed_formats: ["jpg", "png", "jpeg"],
      });

      user.profilePicture = imageInfo.secure_url;
      await user.save();

      return res.status(200).json({ imageInfo: imageInfo });
    } else {
      return res.status(400).json({ errorMessage: "Image is required!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handleProfilePicture };
