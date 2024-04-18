const jwt = require("jsonwebtoken");
const {SECRET} = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET); 
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
