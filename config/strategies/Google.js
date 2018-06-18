const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

const configAuth = require("../auth");

module.exports = passport =>
  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        proxy: true
      },
      function(token, refreshToken, profile, done) {
        User.findOne({ googleId: profile.id }, function(err, user) {
          if (err) return done(err);

          if (user) return done(null, user);

          var newUser = new User();

          newUser.authType = "google";
          newUser.googleId = profile.id;
          newUser.email = profile.emails[0].value;
          newUser.name = profile.displayName;

          newUser.save(function(err) {
            if (err) return done(err);
            done(null, newUser);
          });
        });
      }
    )
  );
