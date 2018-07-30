const mongoose = require("mongoose");
const Tags = mongoose.model("tags");

const saveTags = ({ tags, type }) => {
  if (tags)
    tags.forEach(name => {
      Tags.findOne({ name }, (err, tag) => {
        if (!tag) new Tags({ name, types: [type] }).save();
        else {
          if (!tag.types.includes(type)) {
            tag.types.push(type);
            tag.save();
          }
        }
        return;
      });
    });
};

module.exports = saveTags;
