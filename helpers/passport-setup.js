const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    // console.log('SERIALIZE: ',user)

    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    // console.log('DESERIALIZE: ',user)

    done(null, user);
  });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //If user does not exist in db create the user here
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    // console.log('PROFILE: ',profile)
    return done(null, profile);
  }
));