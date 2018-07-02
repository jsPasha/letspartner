const mongoose = require("mongoose");
const { Schema } = mongoose;
const randomstring = require("randomstring");

// define the schema for our user model
const hashSchema = new Schema({
  email: String,
  hash: {
    type: String,
    default: randomstring.generate()
  }
});

// create the model for users and expose it to our app
mongoose.model("authHash", hashSchema);
