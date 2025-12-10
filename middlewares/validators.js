const normalizeInput = (req, res, next) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      // Trim whitespace + convert to lowercase
      req.body[key] = req.body[key].trim().toLowerCase();
    }
  }

  next();
};

module.exports = {
  normalizeInput,
};
