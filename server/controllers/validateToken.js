export const validateToken = async (req, res, next) => {
  return res.json(req.tokenData);
};
