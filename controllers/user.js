const User = require('../models/User')

exports.createUser = (request, response) => {
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
}