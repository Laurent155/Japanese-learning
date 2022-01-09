const express = require('express');
const { append } = require('express/lib/response');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');
require("../config/passport.js")(passport);
const authRouter = express.Router();


authRouter.route('/signUp').post((req, res) => {
  const { username, password } = req.body;
  const url =
    'mongodb+srv://BigLuke:PrinceOfMauritius7@jplearning.ciime.mongodb.net?retryWrites=true&w=majority';
  const dbName = 'userInfo';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('userInfo').insertOne(user);
      req.login(results.ops[0], () => {
        res.redirect('../auth/profile');
      });
    } catch (error) {
      console.log(error);
    }
    client.close();
  })();
});

authRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '../auth/profile',
      failureRedirect: '../',
    })
  );
  authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
  });

module.exports = authRouter;
