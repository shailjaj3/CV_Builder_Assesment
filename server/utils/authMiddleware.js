const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if the Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({
        message: "Access denied, no token provided or incorrect format.",
      });
  }

  // Extract the token from the "Bearer <token>" string
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID (or other payload data) to the request object
    req.userId = decoded.id;

    // Pass control to the next middleware/route handler
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
