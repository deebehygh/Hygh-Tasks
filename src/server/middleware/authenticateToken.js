//@ts-check
const jwt = require("jsonwebtoken");

module.exports = (secretKey) => {
    return (req, res, next) => {
      const token = req.headers['authorization'];
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {return res.status(403).json({ error: 'Forbidden' });}
        req.user = user;
        next();
      });
    };
};