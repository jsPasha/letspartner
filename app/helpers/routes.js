let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

let isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  res.redirect("/");
};

module.exports = {isLoggedIn, isNotLoggedIn}
