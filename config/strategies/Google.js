const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

const configAuth = require("../auth");

const { saveGoogleImage } = require("../../app/helpers/files");

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
        User.findOne({ googleId: profile.id }, function(err, googleUser) {
          if (err) return done(err);

          if (googleUser) return done(null, googleUser);

          User.findOne({ email: profile.emails[0].value }, async function(
            err,
            localUser
          ) {
            if (localUser) return done(null, localUser);

            const image = await saveGoogleImage(profile.photos[0].value);
            const time = new Date().getTime();

            var newUser = new User({
              authType: "google",
              googleId: profile.id,
              email: profile.emails[0].value,
              originalEmail: profile.emails[0].value,
              name: profile.name.givenName,
              surname: profile.name.familyName,
              image,
              active: true,
              createdAt: time,
              activatedAt: time
            });

            newUser.save(function(err) {
              if (err) return done(err);
              done(null, newUser);
            });
          });
        });
      }
    )
  );
