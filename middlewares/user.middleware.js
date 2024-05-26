import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

function authenticateUser(req, res, next) {
  console.log('hitting');
  const token = req.cookies || req.cookies.token;
  console.log('token', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log('user-middle', err);

    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

export default authenticateUser;