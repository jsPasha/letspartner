const locales = require("../../data/locales");

var setLocale = (req, res, next) => {
  let cookieLoc = req.cookies.localization;
  let fd = req.url.split("/")[1];
  let base = req.baseUrl.substr(1);

  if (fd === "api" || fd === "fonts" || cookieLoc === base || locales.includes(fd))
    return next();

  if (!cookieLoc) {
    let url = base || "ru";
    req.setLocale(url);
    res.cookie("localization", url, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.redirect("/" + url + req.url);
  }

  if (cookieLoc && locales.includes(base)) {
    req.setLocale(base);
    res.cookie("localization", base, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return next();
  }

  res.redirect("/" + cookieLoc + req.url);
};

module.exports = { setLocale };
