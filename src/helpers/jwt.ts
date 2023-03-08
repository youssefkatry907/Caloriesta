import jwt from "jsonwebtoken";

export function generateToken(payload) {
  return jwt.sign(payload, "secret");
}

export function verifyToken(token) {
  return jwt.verify(token, "secret");
}
