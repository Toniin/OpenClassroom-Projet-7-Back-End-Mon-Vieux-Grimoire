const express = require("express");
const router = express.Router();
const authVerif = require("../middleware/auth-verif");
const multerConfig = require("../middleware/multer-config");
const BookCtrl = require("../controllers/book");

router.get("/", BookCtrl.getAllBooks);

router.post("/", authVerif, multerConfig, BookCtrl.createBook);

router.get("/bestrating", (request, response) => {
  response.send({
    message: "GET Liste des 3 livres avec la meilleure moyenne",
  });
});

router.get("/:id", BookCtrl.getOneBook);

router.put("/:id", authVerif, multerConfig, BookCtrl.updateBook);

router.delete("/:id", authVerif, BookCtrl.deleteBook);

router.post("/:id/rating", authVerif, BookCtrl.ratingBook);

module.exports = router;
