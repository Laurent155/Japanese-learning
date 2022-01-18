const express = require('express');
const { append } = require('express/lib/response');
const { MongoClient, ObjectID } = require('mongodb');
const { session } = require('passport');
const passport = require('passport');
require("../config/passport.js")(passport);
const accountRouter = express.Router();
const dotenv = require('dotenv');
dotenv.config()
const calendar = [false, false, false, false, false, false, false];

accountRouter.route('/').get((req, res) => {
    if (!req.user){
        res.render('account');
    } else {
        res.render('profile');
    }
    
});

accountRouter.route('/signUp').post((req, res) => {
  
  const { username, password } = req.body;
  const url = 'mongodb+srv://BigLuke:PrinceOfMauritius7@jplearning.ciime.mongodb.net?retryWrites=true&w=majority';
  const dbName = 'userInfo';

  (async function addUser() {
    let client;
    try {
      client = await MongoClient.connect(url);

      const db = client.db(dbName);
      const user = { username, password, calendar };
      const results = await db.collection('userInfo').insertOne(user);
      req.login(results.ops[0], () => {
        res.redirect('../account');
      });
    } catch (error) {
      console.log(error);
    }
    client.close();
  })();
  
});

accountRouter
  .route('/signIn')
  .get((req, res) => {
    res.render('signin');
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '../account',
      failureRedirect: '../',
    })
  );

module.exports = accountRouter;