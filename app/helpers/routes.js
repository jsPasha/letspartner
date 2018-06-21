let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

let isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
};

let isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
};

module.exports = { isLoggedIn, isNotLoggedIn, isAdmin };
