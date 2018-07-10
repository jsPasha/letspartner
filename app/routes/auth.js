const { isNotLoggedIn } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = templatePath => {
  router.route("/login").get(isNotLoggedIn, function(req, res) {
    res.render(templatePath, {
      content: "../modules/auth/login",
      message: req.flash("loginMessage")
    });
  });

  router.route("/signup").get(isNotLoggedIn, function(req, res) {
    res.render(templatePath, {
      content: "../modules/auth/signup",
      message: req.flash("signupMessage")
    });
  });

  router.route("/restore").get(isNotLoggedIn, function(req, res) {
    const error = req.session.restoreError;
    req.session.restoreError = undefined;

    res.render(templatePath, {
      content: "../modules/auth/restore",
      message: req.flash("restoreMessage"),
      error
    });
  });

  router.get("/reset/:token", function(req, res) {
    User.findOne(
      {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      },
      function(err, user) {
        if (!user) {
          req.flash(
            "restoreMessage",
            "Password reset token is invalid or has expired."
          );
          return res.redirect("/restore");
        }
        res.render(templatePath, {
          content: "../modules/auth/reset",
          message: req.flash("resetMessage")
        });
      }
    );
  });

  return router;
};
