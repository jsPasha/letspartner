const { isLoggedIn, isAdmin } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const News = mongoose.model("news");
const Page = mongoose.model("pages");

const settings = require("../../data/settings.js");

const { generateList } = require("../helpers/list");

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
    const perPage = settings.news.adminList;
    const page = req.params.page || 1;
    const { user, url, locale } = req;
    generateList({
      model: News,
      page,
      perPage,
      locale
    })
      .then(({ objects, count }) => {
        console.log(count);
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          news: objects,
          content: "../modules/admin/modules/news/index",
          current: page,
          pages: Math.ceil(count / perPage),
          user,
          url,
          locale
        });
      })
      .catch(err => res.send("error: /admin/news/:page" + err));
  });

  router.get("/admin/news/:page", [isLoggedIn, isAdmin], (req, res) => {
    const perPage = settings.news.adminList;
    const page = req.params.page || 1;
    const { user, url, locale } = req;
    generateList({
      model: News,
      page,
      perPage,
      locale
    })
      .then(({ objects, count }) => {
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          news: objects,
          content: "../modules/admin/modules/news/index",
          current: page,
          pages: Math.ceil(count / perPage),
          user,
          url,
          locale
        });
      })
      .catch(err => res.send("error: /admin/news/:page" + err));
  });

  router.get(
    "/admin/page-settings/:type",
    [isLoggedIn, isAdmin],
    (req, res) => {
      const { user, url, locale } = req;
      const { type } = req.params;
      Page.findOne({ type }).exec((err, page) => {
        res.render(templatePath, {
          isGuest: !req.isAuthenticated(),
          page: page.content,
          type,
          content: `../modules/admin/modules/${type}/settings`,
          user,
          url,
          locale
        });
      });
    }
  );

  return router;
};
