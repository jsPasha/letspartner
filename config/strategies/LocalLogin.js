const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = passport =>
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true // allows us to pass back the entire request to the callback
      },
      function(req, email, password, done) {
        
        User.findOne({ email }, function(err, user) {
          if (err) return done(err);
          if (!user)
            return done(
              null,
              false,
              req.flash("loginMessage", "No user found.")
            );

          if (user.authType !== "local") {
            return done(
              null,
              false,
              req.flash(
                "loginMessage",
                `You have already been signed up with ${
                  user.authType
                }. Please use it for login`
              )
            );
          }

          if (!user.validPassword(password))
            return done(
              null,
              false,
              req.flash("loginMessage", "Oops! Wrong password.")
            );

          // all is well, return successful user
          return done(null, user);
        });
      }
    )
  );
