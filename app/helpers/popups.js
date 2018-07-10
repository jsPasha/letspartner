const mongoose = require("mongoose");
const Popup = mongoose.model("popups");

const setInfoPopup = (req, res, next) => {
  if (req.url !== "/" && req.user && req.user.showInfoPopup) {
    Popup.findOne({ type: "info" }).exec((err, popup) => {
      if (popup.published) req.infoPopup = popup;
      next();
    });
  } else {
    next();
  }
};

const setPhonePopup = (req, res, next) => {
  if (req.url !== "/" && req.user && !req.user.phone) {
    Popup.findOne({ type: "phone" }).exec((err, popup) => {
      if (popup.published) req.phonePopup = popup;
      next();
    });
  } else {
    next();
  }
}

module.exports = { setInfoPopup, setPhonePopup };
