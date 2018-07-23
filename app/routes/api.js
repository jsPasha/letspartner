const { isLoggedIn, isAdmin } = require("../helpers/routes");
const Languages = require("../controllers/languages");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Tags = mongoose.model("tags");

const companyController = require("../controllers/company");

router.get("/languages", [isLoggedIn, isAdmin], Languages.list);

router.post("/languages", [isLoggedIn, isAdmin], Languages.save);

router.get("/tags", isLoggedIn, (req, res, next) => {
  Tags.find({ name: { $regex: req.query.q } }, (err, items) => {
    res.send(items);
  });
});

router.get("/member", isLoggedIn, companyController.updateMember);

module.exports = router;
