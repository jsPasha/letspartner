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
          //   let outputObject = await setNewsObject(object);
          model.count().exec(function(err, count) {
            if (err) return rej(err);
            objects.forEach((el, i) => {
              moment.locale(locale);
              objects[i].moment = moment(+el.createdAt).format("LLL");
            });
            res({objects, count});
          });
        });
    });
  } else {
    return new Promise((res, rej) => {
      model
        .find()
        .where('published').equals(true)
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, objects) {
          if (err) return rej(err);
         
          //   let outputObject = await setNewsObject(object);
          model.count({ published: true }).exec(function(err, count) {
            if (err) return rej(err);
            objects.forEach((el, i) => {
              moment.locale(locale);
              objects[i].moment = moment(+el.createdAt).format("LLL");
            });
            res({objects, count});
          });
        });
    });
  }
  
};

module.exports = { generateList };
