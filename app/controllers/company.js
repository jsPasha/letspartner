const mongoose = require("mongoose");
const Company = mongoose.model("company");
const { templatePath, company } = require("../../data/settings");

const { generateList } = require("../helpers/list");

const { companyProfileList } = require("../../public/js/templates/company");

const companyController = {
  create: (req, res) => {
    let data = req.body;
    data.type = req.params.type;

    new Company(data).save(err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  update: (req, res, next) => {
    Company.update(req.params, { $set: req.body }, err => {
      if (err) return res.send(err);

      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  createView: (req, res) => {
    res.render(templatePath, {
      content: `../modules/profile/modules/company/${req.params.type}/form`,
      action: "create"
    });
  },
  updateView: (req, res) => {
    Company.findOne(req.query).exec((err, obj) => {
      res.render(templatePath, {
        content: `../modules/profile/modules/company/${req.params.type}/form`,
        action: "update",
        obj
      });
    });
  },
  profileListView: (req, res) => {
    generateListPage(req, res);
  },
  delete: (req, res) => {
    Company.deleteOne(req.params, err => {
      if (err) return res.status(400).send({ err });
      res.redirect(`/${req.locale}/`);
    });
  }
};

const generateListPage = (req, res, next) => {
  const perPage = company.adminList;
  const page = req.params.page || 1;
  const { locale } = req;
  return generateList({
    model: Company,
    page,
    perPage,
    locale,
    published: false
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        objects,
        companyProfileList,
        content: `../modules/profile/modules/company/index`,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(err => res.send("error: /news" + err));
};

module.exports = companyController;
