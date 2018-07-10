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
    res.render(templatePath, {
      content: "../modules/posts/create",
      postTypes,
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

        Posts.countDocuments().exec(function(err, count) {
          if (err) return next(err);
          const { postTypes } = require("../../data/data");
          res.render(templatePath, {
            posts: postsObject,
            content: "../modules/posts/list",
            current: page,
            pages: Math.ceil(count / perPage),
            postTypes,
          });
        });
      });
  });

  return router;
  
};
