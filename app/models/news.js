// load the things we need
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
const newsSchema = new Schema({
  alias: String,
  name: nameModel,
  description: descriptionModel,
  createdAt: { type: String, default: new Date().getTime() },
  published: { type: Boolean, default: true },
  images: {
    thumbNewsImage: String,
    mainNewsImage: String
  }
  
});

// create the model for users and expose it to our app
mongoose.model("news", newsSchema);
