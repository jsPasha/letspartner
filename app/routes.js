const { isLoggedIn } = require("./helpers/routes");
const express = require("express");
const router = express.Router();
const { setLocale } = require("./helpers/locale");
const locales = require("../data/locales");
const { userActivation } = require("./helpers/activation");

const { templatePath } = require("../data/settings");

module.exports = function(app, passport) {
  router.get("/", function(req, res) {
    res.render(templatePath, {
      content: "../modules/index"
    });
  });

  let authRouter = require("./routes/auth")(templatePath);
  let profileRouter = require("./routes/profile")(templatePath);
  let actionRoutes = require("./routes/action")(passport);
  let adminRoutes = require("./routes/admin")(templatePath);
  let newsRoutes = require("./routes/news")(templatePath);

  app.use("/", setLocale);

  app.use("/action", actionRoutes);

  locales.forEach(lang => {
    app.use(`/${lang}`, setLocale, [
      router,
      authRouter,
      userActivation,
      profileRouter,
      adminRoutes,
      newsRoutes
    ]);
  });
};
