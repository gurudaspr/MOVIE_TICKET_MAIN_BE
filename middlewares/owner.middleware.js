import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateOwner(req, res, next) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, owner) => {
    // console.log(err);

    if (err) return res.sendStatus(403);

    req.owner = owner;
    console.log(req.owner.role);
    if (req.owner.role !== "owner") {
      return res.send("not authenticated");
    }
    next();
  });
}
export default authenticateOwner;;