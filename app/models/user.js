// load the things we need
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const { Schema } = mongoose;

// define the schema for our user model
const userSchema = new Schema({
  authType: String,
  googleId: String,
  email: String,
  password: String,
  name: String
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
mongoose.model("users", userSchema);