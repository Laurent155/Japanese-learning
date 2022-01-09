const express = require('express');
const { append } = require('express/lib/response');
const debug = require('debug')('app:authRouter');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');
require("../config/passport.js")(passport);
const authRouter = express.Router();


authRouter.route('/signUp').post((req, res) => {
  const { username, password } = req.body;
  const url =
    'mongodb+srv://LaurentWu155:xadyDImDKONcEiod@japanese.bd1sg.mongodb.net?retryWrites=true&w=majority';
  const dbName = 'japanese';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password };
      const results = await db.collection('japanese').insertOne(user);
      debug(results);
      req.login(results.ops[0], () => {
        res.redirect('/auth/profile');
      });
    } catch (error) {
      debug(error);
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
      successRedirect: '/auth/profile',
      failureRedirect: '/',
    })
  );
  authRouter.route('/profile').get((req, res) => {
    res.json(req.user);
  });

module.exports = authRouter;
