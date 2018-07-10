const mongoose = require("mongoose");
const Corporations = mongoose.model("corporations");
const { templatePath } = require("../../data/settings");

const corporationsController = {
  create: (req, res) => {
    let data = req.body;
    new Corporations(data).save(err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  update: (req, res, next) => {
    Corporations.update(req.params, { $set: req.body }, err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  createView: (req, res) => {
    res.render(templatePath, {
      content: "../modules/profile/modules/corporations/form",
      action: "create"
    });
  },
  updateView: (req, res) => {
    Corporations.findOne(req.query).exec((err, obj) => {
      res.render(templatePath, {
        content: "../modules/profile/modules/corporations/form",
        action: "update",
        obj
      });
    });
  },
  delete: (req, res) => {
    Corporations.deleteOne({ _id: req.params.id }, err => {
      if (err) return res.status(400).send({ err });
      res.redirect(`/${req.locale}/`);
    });
  }
};

module.exports = corporationsController;
