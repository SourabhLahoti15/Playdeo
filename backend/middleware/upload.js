const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "video") {
      cb(null, "uploads/videos/");
    } else if (file.fieldname === "short") {
      cb(null, "uploads/shorts/");
    } else if (file.fieldname === "thumbnail") {
      cb(null, "uploads/thumbnails/");
    } else if (file.fieldname === "images") {
      cb(null, "uploads/images/");
    } else {
      cb(new Error("Invalid file field"), false);
    }
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now();
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB max
  },
  fileFilter
});

module.exports = upload;