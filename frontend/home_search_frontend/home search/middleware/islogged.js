// middleware/auth.js
import jwt from "jsonwebtoken";
import Api_error from "../utility/api.error.js";

const islogged = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new Api_error(401, "Please Log In First");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = decoded; // Attach payload (like _id, email)
    next(); // Continue to controller
  } catch (error) {
    throw new Api_error(401, "Invalid or expired token");
  }
};

export default islogged;
