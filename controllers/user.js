const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = (request, response) => {
  bcrypt
    .hash(request.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: request.body.email,
        password: hash,
      });

      user
        .save()
        .then(() =>
          response
            .status(201)
            .json({ user: user })
            .send(console.log("User created successfully !"))
        )
        .catch((error) => response.status(400).json({ error }));
    })
    .catch((error) => response.status(500).json({ error }));
};

exports.login = (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user === null) {
        response
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrecte." });
      } else {
        bcrypt
          .compare(request.body.password, user.password)
          .then((valid) => {
            if (valid) {
              response.status(200).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user._id },
                  process.env.JWT_PRIVATE_KEY,
                  {
                    expiresIn: "1h",
                  }
                ),
              });
            } else {
              response
                .status(401)
                .json({ message: "Identifiant ou mot de passe incorrecte." });
            }
          })
          .catch((error) => response.status(500).json({ error }));
      }
    })
    .catch((error) => response.status(500).json({ error }));
};
