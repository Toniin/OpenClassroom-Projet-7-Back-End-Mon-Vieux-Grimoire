const express = require("express");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use("/", upload.single("image"), async (request, response, next) => {
  const { buffer, originalname } = request.file;

  const fileExtension = path.extname(originalname);
  const nameWithoutExtension = path.basename(originalname.split(" ").join("_"), fileExtension);
  const editedName = `${nameWithoutExtension}_${Date.now()}.webp`

  request.file = {
    ...request.file,
    editedName: editedName
  };

  await sharp(buffer)
    .resize(405, 568)
    .webp({ quality: 80 })
    .toFile(`images/${editedName}`);
  next();
});

module.exports = router;
