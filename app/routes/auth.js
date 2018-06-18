const { isNotLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

module.exports = (passport, templatePath) => {
  router.route("/login").get(isNotLoggedIn, function(req, res) {
    const { url, locale } = req;
    res.render(templatePath, {
      isGuest: true,
      content: "../modules/auth/login",
      message: req.flash("loginMessage"),
      url,
      locale
    });
  });

  router.route("/signup").get(isNotLoggedIn, function(req, res) {
    const { url, locale } = req;
    res.render(templatePath, {
      isGuest: true,
      content: "../modules/auth/signup",
      message: req.flash("signupMessage"),
      url,
      locale
    });
  });
  return router;
};
