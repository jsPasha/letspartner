const mongoose = require("mongoose");
const User = mongoose.model("users");
const moment = require("moment");
const { postTypes } = require("../../data/data");

let postObject = async posts => {
  for (let i = 0; i < posts.length; i++) {
    posts[i].time = moment(posts[i].createdAt).format(
      "MMMM Do YYYY, h:mm:ss a"
    );
    posts[i].type = postTypes[posts[i].type];
    posts[i].owner = await getOwner(posts[i].owner);
  }

  return posts;
};

let getOwner = async id => {
  return new Promise((res, rej) => {
    User.findById(id, (err, user) => {
      if (err) rej("error");
      res(user.name || "Guest");
    });
  });
};

module.exports = postObject;
