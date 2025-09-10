import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const dummyAuthMiddleware = (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret not configured." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attaching user info to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const createToken = (user) => {
  if (!JWT_SECRET) {
    throw new Error("JWT secret not configured.");
  }
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
};

export default dummyAuthMiddleware;
