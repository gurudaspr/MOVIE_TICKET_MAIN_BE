import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ data: user._id }, secret_key, { expiresIn: "1d" });
};


export const adminToken = (user) => {
  return jwt.sign({ data: user.id, role: user.role }, secret_key, {
    expiresIn: "1d",
  });
};