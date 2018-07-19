const fs = require("fs");
const { templatePath } = require("../../data/settings");
const locales = require("../../data/locales");

const Languages = {
  list: async (req, res) => {
    let list = {};
    for (let i = 0; i < locales.length; i++) {
      list[locales[i]] = await readJson(locales[i]);
    }
    res.send(list);
  },

  save: async (req, res) => {
    const localesJson = req.body.params.data;
    for (let key in localesJson) {
      await writeJson(key, localesJson[key]);
    }
  },

  view: (req, res) => {
    res.render(templatePath, {
      content: "../modules/admin/modules/languages/index"
    });
  }
};

const readJson = el => {
  return new Promise((res, rej) => {
    fs.readFile(`locales/${el}.json`, "utf8", (err, data) => {
      if (err) return rej(err);
      res(JSON.parse(data));
    });
  });
};

const writeJson = (key, json) => {
  return new Promise((res, rej) => {
    fs.writeFile(`locales/${key}.json`, JSON.stringify(json), "utf8", (err, data) => {
      if (err) return rej(err);
      res();
    });
  });
};

module.exports = Languages;
