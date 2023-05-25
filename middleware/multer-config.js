const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "images");
  },
  filename: (request, file, callback) => {
    const fileExtension = path.extname(file.originalname)
    const name = path.basename(file.originalname.split(' ').join('_'), fileExtension)
    callback(null, `${name}_${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage: storage })

module.exports = upload.single('image')