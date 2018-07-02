const { isLoggedIn, isAdmin } = require("../helpers/routes");
const {
  removeTempPath,
  deletePrevious,
  deleteAll
} = require("../helpers/files");

const { generateAlias } = require("../helpers/alias");
const axios = require("axios");
const nodemailer = require("nodemailer");

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
      News.update(
        { _id },
        { $set: { name, description, images, floatContent } },
        err => {
          if (err) return res.send(err);
          res.redirect(`/${req.locale}/admin/news/`);
        }
      );
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
    "/admin/page-settings/:type",
    [isLoggedIn, isAdmin, removeTempPath, deletePrevious],
    (req, res) => {
      let { name, content, image } = req.body;
      const { type } = req.params;
      Page.update(
        { type },
        { $set: { content: { name, content, image } } },
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
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "pkizeev@gmail.com", // generated ethereal user
          pass: "p244w0rdp244w0rd" // generated ethereal password
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: req.user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>" // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
          res.send("no-ok");
          return console.log(error);
        }

        res.status(200).redirect(`/${res.locale}/activation-user`);

      });
    });
  });

  return router;
};
