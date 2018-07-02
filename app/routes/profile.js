const { isLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const { checkLocal } = require("../helpers/locale");

module.exports = templatePath => {
  router.get("/profile", isLoggedIn, (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: false,
      content: "../modules/profile/index",
      user,
      url,
      locale
    });
  });

  router.get('/activation-user', isLoggedIn, (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: false,
      content: "../modules/profile/activation",
      user,
      url,
      locale
    });
  });

  return router;
};
