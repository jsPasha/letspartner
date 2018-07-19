// load the things we need
const mongoose = require("mongoose");
const { Schema } = mongoose;
const locales = require("../../data/locales");

const targetAudienceTypes = require('../../data/settings').company.targetAudienceTypes;

let langModel = {};

locales.forEach((el, i) => (langModel[el] = { type: String }));

// define the schema for our user model
const companySchema = new Schema({
  alias: String,
  type: {
    type: String,
    enum: ["startup", "corporation"]
  },
  status: {
    type: String,
    enum: ["moderation", "published", "draft", "reject"],
    default: "moderation"
  },
  creator: String,
  name: langModel,
  description: langModel,
  images: {
    logo: String,
    thumb: String,
    main: String
  },
  admin_message: {
    reject: String
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
  idea: String,
  problems: String,
  projects: String,
  results: String,
  break_even: String,
  targetAudience: {
    type: {
      type: 'String',
      enum: targetAudienceTypes
    },
    problems: langModel,
    solving: langModel
  },
  tags: [String],
  members: [
    {
      userId: String,
      email: String,
      phone: String,
      position: String,
      name: String,
      surname: String,
      confirmed: {
        type: Boolean,
        default: false
      },
      companyRole: {
        type: String,
        enum: ["member", "founder"]
      },
      image: String,
      about: String,
      adminRole: {
        type: String,
        enum: ["admin", "user"]
      }
    }
  ],
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
  submitedAt: Number,
  description_lang: [String]
});

// create the model for users and expose it to our app
mongoose.model("company", companySchema);
