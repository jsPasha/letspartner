const { isLoggedIn, isBlocked } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const { setInfoPopup } = require("../helpers/popups");

const profileController = require("../controllers/profile");
const corporationsController = require("../controllers/corporations");

module.exports = templatePath => {
  router.get("/activation-user", isLoggedIn, (req, res) => {
    res.render(templatePath, {
      content: "../modules/profile/activation"
    });
  });

  router.get(
    "/profile",
    isLoggedIn,
    setInfoPopup,
    isBlocked,
    profileController.view
  );

  router.get(
    "/profile/corporations/create",
    isLoggedIn,
    corporationsController.createView
  );

  router.get(
    "/profile/corporations/update/:createdAt/:alias",
    isLoggedIn,
    corporationsController.updateView
  );

  return router;
};
