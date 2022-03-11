const passport = require("passport");
const { Strategy } = require("passport-local");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        const url = process.env.databaseURL;
        const dbName = "userInfo";
        let client;
        try {
          client = await MongoClient.connect(url);
          console.log("Connected to the mongo DB");

          const db = client.db(dbName);

          const user = await db.collection("userInfo").findOne({ username });

          if (user && user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (error) {
          done(error, false);
        }
        //client.close();
      }
    )
  );
};
