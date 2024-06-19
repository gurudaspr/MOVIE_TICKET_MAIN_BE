import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateOwner(req, res, next) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, owner) => {

    if (err) return res.sendStatus(403);

    req.owner = owner;
    if (req.owner.role !== "owner") {
      return res.send("not authenticated");
    }
    next();
  });
}
export default authenticateOwner;;