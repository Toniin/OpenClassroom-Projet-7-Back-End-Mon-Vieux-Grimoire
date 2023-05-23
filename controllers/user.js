const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.signup = (request, response) => {
  const userObject = request.body;
  const user = new User(userObject);
  user
    .save()
    .then(() =>
      response
        .status(201)
        .json({ user: user })
        .send(console.log("User created successfully !"))
    )
    .catch((error) => response.status(400).json({ error }));
};

exports.login = (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user === null) {
        response
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrecte." });
      } else {
        response.status(200).json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: "1h",
          }),
        });
      }
    })
    .catch((error) => response.status(500).json({ error }));
};
