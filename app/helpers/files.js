const fs = require("fs");
const mongoose = require("mongoose");
const News = mongoose.model("news");
const _ = require("lodash");

const removeTempPath = (req, res, next) => {
  let files = req.body.images;
  for (let key in files) remove(files, key);

  req.body.floatContent.forEach(el => {
    if (el.contentType === "gallery") {
      let gallery = el.gallery;
      gallery.forEach((el, index) => {
        remove(gallery, index);
      });
    }
  });

  next();
};

const remove = (images, key) => {
  let path = images[key];
  if (path && typeof path === "string" && path.split("/")[1] === "temp") {
    let oldPath = `public/uploads${path}`;
    let pathArr = path.split("/");
    pathArr.splice(1, 1);
    let newPath = pathArr.join("/");
    images[key] = newPath;
    newPath = `public/uploads${newPath}`;
    replaceContents(newPath, oldPath, err => {
      if (err) console.log(err);
      fs.unlink(oldPath, err => {
        if (err) console.log(err);
      });
    });
  }
};

const deletePrevious = (req, res, next) => {
  let files = req.body.fileForDelete;
  if (files)
    files.forEach(el => {
      fs.unlink(`public/uploads${el}`, err => {
        if (err) console.log(err);
      });
    });
  next();
};

function replaceContents(file, replacement, cb) {
  fs.readFile(replacement, (err, contents) => {
    if (err) return cb(err);
    fs.writeFile(file, contents, cb);
  });
}

const deleteAll = (req, res, next) => {
  let _id = req.params.id;

  News.findById(_id, (err, news) => {
    let images = news.images;
    if (images)
      for (let key in images) {
        if (typeof images[key] === "string" && images[key] !== "")
          fs.unlink(`public/uploads${images[key]}`, err => {
            if (err) console.log(err);
          });
      }
    news.floatContent.forEach(el => {
      if (el.contentType === "gallery") {
        let gallery = el.gallery;
        gallery.forEach((el, index) => {
          fs.unlink(`public/uploads${gallery[index]}`, err => {
            if (err) console.log(err);
          });
        });
      }
    });
    next();
  });
};

module.exports = { removeTempPath, deletePrevious, deleteAll };
