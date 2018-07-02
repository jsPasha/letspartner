const { isLoggedIn } = require("./helpers/routes");
const express = require("express");
const router = express.Router();
const { setLocale } = require("./helpers/locale");
const locales = require("../data/locales");
const userActivation = require("./helpers/activation");

module.exports = function(app, passport) {
  const templatePath = "layouts/main";

  router.get("/", function(req, res) {
    const { user, url, locale } = req;
    res.render(templatePath, {
      isGuest: !req.isAuthenticated(),
      content: "../modules/index",
      user,
      url,
      locale
    });
  });

  let authRouter = require("./routes/auth")(passport, templatePath);
  let postsRouter = require("./routes/posts")(templatePath);
  let profileRouter = require("./routes/profile")(templatePath);
  let apiRoutes = require("./routes/action")(passport);
  let adminRoutes = require("./routes/admin")(templatePath);
  let newsRoutes = require("./routes/news")(templatePath);

  app.use("/", setLocale, [
    router,
    // userActivation,
    authRouter,
    postsRouter,
    profileRouter,
    newsRoutes
  ]);

  app.use("/action", apiRoutes);

  locales.forEach(lang => {
    app.use(`/${lang}`, setLocale, [
      router,
      authRouter,
      // userActivation,
      postsRouter,
      profileRouter,
      adminRoutes,
      newsRoutes
    ]);
  });
};
