const { isLoggedIn, isAdmin } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const News = mongoose.model("news");
const Page = mongoose.model("pages");
const Popup = mongoose.model("popups");
const Users = mongoose.model("users");

const settings = require("../../data/settings.js");

const { generateList } = require("../helpers/list");
const userList = require("../../public/js/templates/users");

const timezoneJson = require("timezones.json");

module.exports = templatePath => {
  router.get("/admin", [isLoggedIn, isAdmin], (req, res) => {
    res.render(templatePath, {
      content: "../modules/admin/index"
    });
  });

  router.get("/admin/news/create", [isLoggedIn, isAdmin], (req, res) => {
    res.render(templatePath, {
      content: "../modules/admin/modules/news/form",
      action: "create"
    });
  });

  router.get("/admin/news/update/:id", [isLoggedIn, isAdmin], (req, res) => {
    const id = req.params.id;

    News.findById(id, (err, newsItem) => {
      if (err) return res.send(err);
      res.render(templatePath, {
        content: "../modules/admin/modules/news/form",
        action: "update",
        newsItem
      });
    });
  });

  router.get("/admin/news", [isLoggedIn, isAdmin], (req, res) => {
    generateNewsPage(req, res, templatePath);
  });

  router.get("/admin/news/:page", [isLoggedIn, isAdmin], (req, res) => {
    generateNewsPage(req, res, templatePath);
  });

  router.get("/admin/users", [isLoggedIn, isAdmin], (req, res) => {
    generateUsersPage(req, res, templatePath);
  });

  router.get("/admin/users/:page", [isLoggedIn, isAdmin], (req, res) => {
    generateUsersPage(req, res, templatePath);
  });

  router.get("/admin/users/update/:id", [isLoggedIn, isAdmin], (req, res) => {
    const id = req.params.id;

    Users.findById(id, (err, user) => {
      if (err) return res.send(err);
      res.render(templatePath, {
        user,
        content: "../modules/admin/modules/users/form",
        timezoneJson,
        message: req.flash("profileMessage")[0]
      });
    });
  });

  router.get("/admin/popups", [isLoggedIn, isAdmin], (req, res) => {
    Popup.find().exec((err, popups) => {
      res.render(templatePath, {
        popups,
        content: `../modules/admin/modules/popups/index`
      });
    });
  });

  router.get("/admin/popups/update/:id", [isLoggedIn, isAdmin], (req, res) => {
    const id = req.params.id;

    Popup.findById(id, (err, popup) => {
      if (err) return res.send(err);
      res.render(templatePath, {
        content: "../modules/admin/modules/popups/form",
        popup: popup.content,
        id: popup.id
      });
    });
  });

  router.get(
    "/admin/page-settings/:type",
    [isLoggedIn, isAdmin],
    (req, res) => {
      const { type } = req.params;
      Page.findOne({ type }).exec((err, page) => {
        res.render(templatePath, {
          page: page.content,
          type,
          content: `../modules/admin/modules/${type}/settings`
        });
      });
    }
  );

  return router;
};

const generateNewsPage = (req, res, templatePath) => {
  const perPage = settings.news.adminList;
  const page = req.params.page || 1;
  const { locale } = req;
  generateList({
    model: News,
    page,
    perPage,
    locale
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        news: objects,
        content: "../modules/admin/modules/news/index",
        current: page,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(err => res.send("error: /admin/news/:page" + err));
};

const generateUsersPage = (req, res, templatePath) => {
  const perPage = settings.news.adminList;
  const page = req.params.page || 1;
  const { locale } = req;
  generateList({
    model: Users,
    page,
    perPage,
    locale
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        users: objects,
        content: "../modules/admin/modules/users/index",
        current: page,
        pages: Math.ceil(count / perPage),
        userList
      });
    })
    .catch(err => res.send("error: /admin/users/:page" + err));
};