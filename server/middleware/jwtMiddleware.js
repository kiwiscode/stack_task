const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // get the header from authorization information
  const authHeader = req.header.authorization;
  // get the token from authorization
  const token = authHeader && authHeader.split(" ")[1];

  // if token not valid send error
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // confirm the token and get info from spesific user
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
