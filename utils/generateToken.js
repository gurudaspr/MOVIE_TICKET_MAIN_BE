import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ data: user._id }, secret_key, { 
    expiresIn: "1d" });
};


export const adminToken = (owner) => {
  return jwt.sign({ ownerId: owner.id, role: owner.role }, secret_key, {
    expiresIn: "1d",
  });
};