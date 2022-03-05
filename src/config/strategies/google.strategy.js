const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require('dotenv');
const { MongoClient, ObjectID } = require('mongodb');
const url = process.env.databaseURL;
const passport = require('passport');
const calendar = [false, false, false, false, false, false, false];

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback   : true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    const email = profile.email || 'l.wu16@ejm.org';
    console.log(profile);
    const username = profile.name || 'Joel';
    try {
        client = await MongoClient.connect(url);
  
        const db = client.db('userInfo');
        const user = { email, username, calendar };
        const existUser = await db.collection('userInfo').find({username}).count();
        if(existUser === 0){
          const results = await db.collection('userInfo').insertOne(user);
          return done(false, results);
        }
        return done(false, existUser);
        
        
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
  }
));