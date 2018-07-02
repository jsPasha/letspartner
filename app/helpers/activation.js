module.exports = (req, res, next) => {
  if (
    req.user &&
    req.url.indexOf("/activation-user") === -1 &&
    req.url.indexOf("/action/") === -1 &&
    !req.user.active
  ) {
    return res.redirect(`/${req.locale}/activation-user`);
  }
  next();
};
