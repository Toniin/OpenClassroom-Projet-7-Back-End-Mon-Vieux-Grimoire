const express = require("express");
const router = express.Router();
const UserCtrl = require("../controllers/user");

router.post("/signup", UserCtrl.createUser);

router.post("/login", (request, response) => {
  response.send({
    message: "POST Se connecter",
  });
});

module.exports = router;
