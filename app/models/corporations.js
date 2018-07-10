// load the things we need
const mongoose = require("mongoose");
const { Schema } = mongoose;
const locales = require("../../data/locales");

let langModel = {};

locales.forEach((el, i) => (langModel[el] = { type: String }));

// define the schema for our user model
const corporationSchema = new Schema({
  alias: String,
  creator: String,
  admin: [String],
  name: langModel,
  description: langModel,
  images: {
    logo: String,
    thumb: String,
    main: String
  },
  phones: [String],
  social: {
    website: String,
    fasebook: String,
    linkedin: String
  },
  locations: [
    {
      lat: String,
      lng: String
    }
  ],
  directions: [String],
  activity: String,
  stages: [String],
  tags: [String],
  members: [String],
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
  description_lang: [String]
});

// create the model for users and expose it to our app
mongoose.model("corporations", corporationSchema);
