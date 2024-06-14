import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateUser(req, res, next) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // console.log(err,'Error');
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}




export default authenticateUser;;