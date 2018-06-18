const { isLoggedIn } = require("../helpers/routes");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Posts = mongoose.model("posts");

const postObject = require("../helpers/posts");
const itemPerPage = require('../../data/settings').itemPerPage;

module.exports = templatePath => {
  router.route("/posts/create").get(isLoggedIn, (req, res) => {
    const { postTypes } = require("../../data/data");
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: !req.isAuthenticated(),
      content: "../modules/posts/create",
      postTypes,
      user,
      url,
      locale
    });
  });

  router.get("/posts", (req, res) => {
    res.redirect(`/${req.locale}/posts/1`);
  });

  router.get("/posts/:page", (req, res) => {
    var perPage = itemPerPage;
    var page = req.params.page || 1;
    Posts.find()
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(async function(err, posts) {
        let postsObject = await postObject(posts);

        Posts.count().exec(function(err, count) {
          if (err) return next(err);
          const { postTypes } = require("../../data/data");
          const { user, url, locale } = req;
          res.render(templatePath, {
            isGuest: !req.isAuthenticated(),
            posts: postsObject,
            content: "../modules/posts/list",
            current: page,
            pages: Math.ceil(count / perPage),
            user: req.user,
            postTypes,
            user,
            url,
            locale
          });
        });
      });
  });

  return router;
};
