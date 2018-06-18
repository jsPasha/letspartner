const { isLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require('mongoose');
const Posts = mongoose.model("posts");

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

  return router;
};
