// load the things we need
const mongoose = require('mongoose');
const { Schema } = mongoose;

// define the schema for our user model
const postSchema = new Schema({
  head: String,
  content: String,
  owner: String,
  createdAt: Number,
  updatedAt: Number,
  type: String
});

// create the model for users and expose it to our app
mongoose.model("posts", postSchema);