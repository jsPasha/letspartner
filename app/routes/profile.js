const { isLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const { checkLocal } = require("../helpers/locale");

module.exports = templatePath => {
  router.get("/profile", isLoggedIn, (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: !req.isAuthenticated(),
      content: "../modules/profile/index",
      user,
      url,
      locale
    });
  });

  return router;
};
