const moment = require("moment");

const generateList = params => {
  let { model, page, perPage, locale, published } = params;

  if (!published) {
    return new Promise((res, rej) => {
      model
        .find()
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, objects) {
          if (err) return rej(err);
          model.countDocuments().exec(function(err, count) {
            if (err) return rej(err);
            objects.forEach((el, i) => {
              let timeMoment = +el.activatedAt || +el.createdAt;
              moment.locale(locale);
              objects[i].moment = moment(timeMoment).format("LLL");
            });
            res({ objects, count });
          });
        });
    });
  } else {
    return new Promise((res, rej) => {
      model
        .find()
        .where("published")
        .equals(true)
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, objects) {
          if (err) return rej(err);
          model.countDocuments({ published: true }).exec(function(err, count) {
            if (err) return rej(err);
            objects.forEach((el, i) => {
              let timeMoment = +el.activatedAt || +el.createdAt;
              moment.locale(locale);
              objects[i].moment = moment(timeMoment).format("LLL");
            });
            res({ objects, count });
          });
        });
    });
  }
};

module.exports = { generateList };
