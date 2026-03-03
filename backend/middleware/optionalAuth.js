import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
  } catch (err) {
    // if token invalid, ignore it
  }

  next();
};

export { optionalAuth }