const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Site = require("../controllers/site");

router.get("/companies/:type", Site.companies.list);

module.exports = router;
