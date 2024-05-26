import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if(!token){
    return res.status(403).send('token not found');
  }
jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log('user-middle',err);

    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

export default authenticateUser;