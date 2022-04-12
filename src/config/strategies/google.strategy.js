const GoogleStrategy = require("passport-google-oauth2").Strategy;
const dotenv = require("dotenv");
const { MongoClient, ObjectID } = require("mongodb");
const url = process.env.databaseURL;
const passport = require("passport");
const calendar = [false, false, false, false, false, false, false];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const email = profile.email;
      // console.log('profile here')
      // console.log(profile);
      // here we should use the email because google doesn't provide the username
      // const username = profile.given_name;
      const username = profile.email;
      const profileimg = profile.picture;
      try {
        client = await MongoClient.connect(url);
        const db = client.db("userInfo");
        const user = { email, username, calendar, profileimg };
        const existUser = await db
          .collection("userInfo")
          .findOne({ username })
        if (existUser === null) {
          const results = await db.collection("userInfo").insertOne(user);
          return done(false, results.ops[0]);
        }
        return done(false, existUser);
      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);
