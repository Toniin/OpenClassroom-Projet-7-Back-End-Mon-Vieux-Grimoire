const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send({
    message: "POST S'inscrire",
  });
});

router.post("/login", (req, res) => {
  res.send({
    message: "POST Se connecter",
  });
});

module.exports = router;
