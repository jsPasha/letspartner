const mongoose = require("mongoose");
const { Schema } = mongoose;

const locales = require("../../data/locales");

let nameModel = {},
  descriptionModel = {};

locales.forEach((el, i) => {
  nameModel[el] = { type: String };
  descriptionModel[el] = { type: String };

  // default name is required
  if (i === 0) nameModel[el].require = true;
});

// define the schema for our user model
const pageSchema = new Schema({
  news: {
    name: nameModel,
    description: descriptionModel,
    image: String
  },
  startups: {
    name: nameModel,
    description: descriptionModel,
    image: String
  },
  corporate: {
    name: nameModel,
    description: descriptionModel,
    image: String
  }
});

// create the model for users and expose it to our app
mongoose.model("pages", pageSchema);
