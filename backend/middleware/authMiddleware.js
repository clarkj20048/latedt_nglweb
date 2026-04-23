const jwt = require("jsonwebtoken");

function requireAdminAuth(req, _res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    return next(error);
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET environment variable is required.");
    error.statusCode = 500;
    return next(error);
  }

  try {
    const token = authHeader.slice(7);
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (_error) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = {
  requireAdminAuth,
};
