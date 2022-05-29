import jwt from "jsonwebtoken";
export const middleValidation = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.tokenData = decoded;

    next();
  });
};
