import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided.' });

  // Support 'Bearer <token>' format
  if (token.startsWith('Bearer ')) {
    token = token.slice(7).trim();
  }

  jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Failed to authenticate token.' });
    req.user = { _id: decoded.id, email: decoded.email };
    next();
  });
}; 