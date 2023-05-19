const express = require("express");
const router = express.Router();
const BookCtrl = require("../controllers/book");

// const data = require("../../frontend/public/data/data.json");
// const Book = require("../models/Book");
// data.map((data) => {
//   const book = new Book(data);
//   console.log(book);
//   book.save().then(() => console.log(book));
// });

router.get("/", BookCtrl.getAllBook);

router.post("/", (req, res) => {
  res.send({
    message: "POST Créer un nouveau livre",
    auth: "REQUIS",
  });
});

router.get("/bestrating", (req, res) => {
  res.send({
    message: "GET Liste des 3 livres avec la meilleure moyenne",
  });
});

router.get("/:id", BookCtrl.getOneBook);

router.put("/:id", (req, res) => {
  res.send({
    message: "GET Met à jour le livre avec l'id fourni",
    auth: "REQUIS",
  });
});

router.delete("/:id", (req, res) => {
  res.send({
    message: "GET Supprime le livre avec l'id fourni",
    auth: "REQUIS",
  });
});

router.post("/:id/rating", (req, res) => {
  res.send({
    message: "GET Ajoute une note au livre avec l'id fourni",
    auth: "REQUIS",
  });
});

module.exports = router;
