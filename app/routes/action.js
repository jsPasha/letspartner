const { isLoggedIn, isAdmin } = require("../helpers/routes");
const {
  removeTempPath,
  deletePrevious,
  deleteAll
} = require("../helpers/files");

const { generateAlias } = require("../helpers/alias");
const axios = require("axios");

const {
  sendActivationLetter,
  setActivation
} = require("../helpers/activation");

const { sendRestoreMail, resetPassword } = require("../helpers/restore");
const userList = require("../../public/js/templates/users");

const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

const mongoose = require("mongoose");
const Posts = mongoose.model("posts");

const Page = mongoose.model("pages");
const Popup = mongoose.model("popups");

const newsController = require("../controllers/news");
const profileController = require("../controllers/profile");
const corporaionsController = require("../controllers/corporations");

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
      successRedirect: "/action/send-activation", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect(`/${req.locale}/`);
  });

  router.post("/restore", function(req, res, next) {
    sendRestoreMail(req)
      .then(() => {
        req.session.restoreError = false;
        res.redirect("/restore");
      })
      .catch(err => {
        req.session.restoreError = true;
        res.redirect("/restore");
      });
  });

  router.post("/reset/:token", function(req, res) {
    resetPassword(req)
      .then(() => res.redirect(`/${req.locale}/profile`))
      .catch(err => res.redirect(req.url));
  });

  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
    })
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
    isLoggedIn,
    isAdmin,
    removeTempPath,
    generateAlias,
    newsController.create
  );

  router.post(
    "/news/update/:id",
    isLoggedIn,
    isAdmin,
    removeTempPath,
    deletePrevious,
    newsController.update
  );

  router.get(
    "/news/delete/:id",
    isLoggedIn,
    isAdmin,
    deleteAll,
    newsController.delete
  );

  router.post("/corporations/create", [
    isLoggedIn,
    removeTempPath,
    generateAlias,
    corporaionsController.create
  ]);

  router.post("/corporations/update/:createdAt/:alias", [
    isLoggedIn,
    isAdmin,
    removeTempPath,
    deletePrevious,
    corporaionsController.update
  ]);

  router.post(
    "/popup/update/:id",
    [isLoggedIn, isAdmin, removeTempPath, deletePrevious],
    (req, res, next) => {
      let { content } = req.body;
      console.log(content);
      let _id = req.params.id;
      Popup.update({ _id }, { $set: { content } }, err => {
        if (err) return res.send(err);
        res.redirect(`/${req.locale}/admin/popups/`);
      });
    }
  );

  router.post(
    "/profile/update",
    isLoggedIn,
    removeTempPath,
    deletePrevious,
    profileController.updateMe
  );

  router.post(
    "/profile/update/:id",
    isLoggedIn,
    isAdmin,
    removeTempPath,
    deletePrevious,
    profileController.update
  );

  router.post("/upload/cropped-image", isLoggedIn, (req, res, err) => {
    const fileName = `/temp/${uniqid()}.png`;
    const filePath = `/uploads${fileName}`;
    fs.writeFile(`public${filePath}`, req.files.croppedImage.data, err => {
      if (err) return res.status(400).send({ err });
      res.send({ fileName });
    });
  });

  router.post("/file/delete/", isLoggedIn, (req, res) => {
    fs.unlink(`public/uploads${req.body.url}`, err => {
      if (err) return res.send("no-file");
      res.send("ok");
    });
  });

  router.post("/popup-visibility", [isLoggedIn], (req, res) => {
    let { val } = req.body;
    let { id } = req.user;
    User.update({ _id: id }, { $set: { showInfoPopup: !val } }, err => {
      if (err) return res.send(err);
      res.send(id);
    });
  });

  router.post("/set-state/", [isLoggedIn, isAdmin], (req, res) => {
    let { model, id, value, state } = req.body;
    let Model = null;
    switch (model) {
      case "news":
        Model = News;
        break;
      case "popup":
        Model = Popup;
        break;
      case "user":
        Model = User;
        break;
      default:
        break;
    }
    let $set = {};
    $set[state] = value;
    Model.update({ _id: id }, { $set }, err => {
      if (err) return res.send(err);
      res.send(state + " - ok!");
    });
  });

  router.post(
    "/admin/page-settings/:type",
    [isLoggedIn, isAdmin, removeTempPath, deletePrevious],
    (req, res) => {
      let { name, description, image } = req.body;
      const { type } = req.params;
      Page.update(
        { type },
        { $set: { content: { name, description, image } } },
        err => {
          if (err) return res.send(err);
          res.redirect(`/${req.locale}/admin/`);
        }
      );
    }
  );

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

  router.get("/youtube-info", (req, res) => {
    axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=id%2C+snippet&id=${
          req.query.id
        }&key=AIzaSyCtRBHfdZXAd6heEAhKv01N9xmy0PELBJw`
      )
      .then(response => {
        const { title, thumbnails } = response.data.items[0].snippet;
        res.send({ title, thumbnails });
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.get("/send-activation", (req, res, next) => {
    sendActivationLetter(req)
      .then(err => {
        if (err) return res.send(err);
        res.redirect(`/${res.locale}/activation-user`);
      })
      .catch(err => res.send(err));
  });

  router.get("/activate", (req, res) => {
    setActivation(req)
      .then(() => {
        res.redirect(`/${req.locale}/profile`);
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.get("/user-autocomplete", [isLoggedIn, isAdmin], (req, res) => {
    const { term } = req.query;
    User.find({ email: { $regex: term } }).exec((err, items) => {
      let results = [];
      items.forEach(el => {
        results.push({
          label: el.email,
          value: el.email
        });
      });
      res.send(results);
    });
  });

  router.get("/get-user", [isLoggedIn, isAdmin], (req, res) => {
    const { email } = req.query;
    const { user, locale } = req;
    User.findOne({ email }).exec((err, oneUser) => {
      res.send(userList({ users: [oneUser], user, locale }));
    });
  });

  return router;
};
