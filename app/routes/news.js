const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const settings = require("../../data/settings.js");

const News = mongoose.model("news");

const { generateList } = require("../helpers/list");

module.exports = templatePath => {
  router.get("/news", (req, res) => {
    const perPage = settings.news.pageList;
    const page = req.params.page || 1;
    const { user, url, locale } = req;
    generateList({
      model: News,
      page,
      perPage,
      locale,
      published: true
    })
      .then(({ objects, count }) => {
        console.log(count);
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          news: objects,
          content: "../modules/news/index",
          current: page,
          pages: Math.ceil(count / perPage),
          user,
          url,
          locale
        });
      })
      .catch(err => res.send("error: /news" + err));
  });

  router.get("/news/:page", (req, res) => {
    const perPage = settings.news.pageList;
    const page = req.params.page || 1;
    const { user, url, locale } = req;
    generateList({
      model: News,
      page,
      perPage,
      locale,
      published: true
    })
      .then(({ objects, count }) => {
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          news: objects,
          content: "../modules/news/index",
          current: page,
          pages: Math.ceil(count / perPage),
          user,
          url,
          locale
        });
      })
      .catch(err => res.send("error: /news" + err));
  });

  router.get("/news/page/:createdAt/:alias", (req, res, next) => {
    const { createdAt, alias } = req.params;
    const { user, url, locale } = req;
    News.findOne({ createdAt, alias }, function(err, news) {
      if (err) return res.status(400).send("error");
      if (!news) return res.status(404).send("not found");
      res.render(templatePath, {
        isGuest: !req.isAuthenticated(),
        content: "../modules/news/view",
        user,
        url,
        locale,
        news
      });
    });
  });

  return router;
};
