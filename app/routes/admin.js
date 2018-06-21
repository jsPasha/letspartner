const { isLoggedIn, isAdmin } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const News = mongoose.model("news");

const setNewsObject = require("../helpers/news");

module.exports = templatePath => {
  router.get("/admin", [isLoggedIn, isAdmin], (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: false,
      content: "../modules/admin/index",
      user,
      url,
      locale
    });
  });

  router.get("/admin/news/create", [isLoggedIn, isAdmin], (req, res) => {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: false,
      content: "../modules/admin/modules/news/form",
      action: "create",
      user,
      url,
      locale
    });
  });

  router.get("/admin/news/update/:id", [isLoggedIn, isAdmin], (req, res) => {
    const id = req.params.id;
    const { user, url, locale } = req;
    News.findById(id, (err, newsItem) => {
      if (err) res.send(err);
      res.render(templatePath, {
        isGuest: false,
        content: "../modules/admin/modules/news/form",
        action: "update",
        user,
        newsItem,
        url,
        locale
      });
    });
  });

  router.get("/admin/news", [isLoggedIn, isAdmin], (req, res) => {
    generateList(templatePath, req, res, "../modules/admin/modules/news/index");
  });

  router.get("/admin/news/:page", [isLoggedIn, isAdmin], (req, res) =>
    generateList(templatePath, req, res, "../modules/admin/modules/news/index")
  );

  return router;
};

let generateList = (templatePath, req, res, content) => {
  let perPage = 20;
  let page = req.params.page || 1;
  News.find()
    .sort({ createdAt: -1 })
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(async function(err, news) {
      let newsObject = await setNewsObject(news);

      News.count().exec(function(err, count) {
        if (err) return next(err);
        const { user, url, locale } = req;
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          news: newsObject,
          content,
          current: page,
          pages: Math.ceil(count / perPage),
          user,
          url,
          locale
        });
      });
    });
};
