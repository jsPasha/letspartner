const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const News = mongoose.model("news");

module.exports = templatePath => {
  router.get("/news", (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: !req.isAuthenticated(),
      content: "../modules/news/index",
      user,
      url,
      locale
    });
  });
  return router;
};
