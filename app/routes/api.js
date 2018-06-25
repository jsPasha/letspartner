const { isLoggedIn, isAdmin } = require("../helpers/routes");
const {
  removeTempPath,
  deletePrevious,
  deleteAll
} = require("../helpers/files");
const { generateAlias } = require("../helpers/alias");

const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

const mongoose = require("mongoose");
const Posts = mongoose.model("posts");
const News = mongoose.model("news");
const Page = mongoose.model("pages");

module.exports = passport => {
  router.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  router.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect(`/${req.locale}/`);
  });

  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  router.post("/posts/create", isLoggedIn, (req, res) => {
    let params = {
      owner: req.user.id,
      head: req.body.head,
      content: req.body.content,
      createdAt: new Date().getTime(),
      type: req.body.type
    };
    let post = new Posts(params);
    post.save(err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/posts/1`);
    });
  });

  router.post(
    "/news/create",
    [isLoggedIn, isAdmin, removeTempPath, generateAlias],
    (req, res, next) => {
      let { name, description, images, alias, floatContent } = req.body;
      let news = new News({ name, description, images, alias, floatContent });
      news.save(err => {
        if (err) return res.send(err);
        res.redirect(`/${req.locale}/admin/news/`);
      });
    }
  );

  router.post(
    "/news/update/:id",
    [isLoggedIn, isAdmin, removeTempPath, deletePrevious],
    (req, res, next) => {
      let { name, description, images, floatContent } = req.body;
      let _id = req.params.id;
      News.update({ _id }, { $set: { name, description, images, floatContent } }, err => {
        if (err) return res.send(err);
        res.redirect(`/${req.locale}/admin/news/`);
      });
    }
  );

  router.get(
    "/news/delete/:id",
    [isLoggedIn, isAdmin, deleteAll],
    (req, res, next) => {
      let _id = req.params.id;
      News.deleteOne({ _id }, err => {
        if (err) return res.status(400).send({ err });
        res.redirect(`/${req.locale}/admin/news/`);
      });
    }
  );

  router.post(
    "/upload/cropped-image",
    [isLoggedIn, isAdmin],
    (req, res, err) => {
      const fileName = `/temp/${uniqid()}.png`;
      const filePath = `/uploads${fileName}`;
      fs.writeFile(`public${filePath}`, req.files.croppedImage.data, err => {
        if (err) return res.status(400).send({ err });
        res.send({ fileName });
      });
    }
  );

  router.post("/file/delete/", [isLoggedIn, isAdmin], (req, res) => {
    fs.unlink(`public/uploads${req.body.url}`, err => {
      if (err) return res.status(400).send({ err });
      res.send("ok");
    });
  });

  router.post("/publish/", [isLoggedIn, isAdmin], (req, res) => {
    let { model, id, value } = req.body;
    let Model = null;
    switch (model) {
      case "news":
        Model = News;
        break;
      default:
        break;
    }
    Model.update({ _id: id }, { $set: { published: value } }, err => {
      if (err) return res.send(err);
      res.send("publish - ok!");
    });
  });

  router.post(
    "/api/admin/page-settings/news",
    [isLoggedIn, isAdmin, removeTempPath, deletePrevious],
    (req, res, next) => {
      let { name, description, images } = req.body;
      let _id = req.params.id;
      Page.update({ _id }, { $set: { name, description, images } }, err => {
        if (err) return res.send(err);
        res.redirect(`/${req.locale}/admin/news/`);
      });
    }
  );

  router.get("/create-pages/", [isLoggedIn, isAdmin], (req, res) => {
    Page.find()
      .count()
      .exec((err, el) => {
        if (el) return res.status(200).send("already created");
        let page = new Page({
          news: {
            name: {
              ru: "",
              en: "",
              ua: ""
            },
            description: {
              ru: "",
              en: "",
              ua: ""
            },
            image: ""
          }
        });
        page.save((err, el) => {
          if (err) return res.send("error:" + err);
          res.send("ok");
        });
      });
  });

  router.post("/upload/constructor_image", (req, res) => {
    const fileName = `/temp/${uniqid()}.png`;
    const filePath = `/uploads${fileName}`;
    const index = req.body.index;
    const delUrl = req.body.url;

    if (delUrl)
      fs.unlink(`public/uploads${delUrl}`, err => {
        if (err) console.log(err);
      });

    fs.writeFile(`public${filePath}`, req.files.image.data, err => {
      if (err) return res.status(400).send({ err });
      res.send({ fileName, index });
    });
  });

  return router;
};
