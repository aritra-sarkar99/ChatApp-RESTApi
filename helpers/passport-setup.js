const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const Users = require('../models/users')

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
  async function(accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        name: profile.displayName
      }

      try{
        let user = await Users.findOne({googleId: profile.id})
        if(user){
          return done(null, user);
        }
        else{
          user = await Users.create(newUser)
          return done(null,user)
        }
      }catch(err){
        console.log(err)
      }
    
    
  }
));