const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const userId = decodedToken.userId;
    request.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    response.status(401).json({ error: error.message });
  }
};
