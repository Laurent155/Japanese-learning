const express = require('express');
const { append } = require('express/lib/response');
const { MongoClient, ObjectID } = require('mongodb');
const passport = require('passport');
require("../config/passport.js")(passport);
const calendarRouter = express.Router();
const dotenv = require('dotenv');
dotenv.config()

// the route method: it's setting an endpoint to be called through 'GET', 'POST' requests.
// .get is to handle all get requests, similarly for .post, to handle/ differentiate between post requests, assign different routes.
// in a post request, you can send data to backend from frontend (website), if want to call another function or do another thing, create another endpoint.

calendarRouter.route('/').get((req, res) => {
    res.render('calendar');
}).post((req, res) => {
  console.log(req.user);
  updatePersonalCalendar(req.user.username);
  res.send('received');
})

const url = 'mongodb+srv://BigLuke:PrinceOfMauritius7@jplearning.ciime.mongodb.net?retryWrites=true&w=majority';
const client = new MongoClient(url);
async function updateCalendar() {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const userInfo = database.collection("userInfo");
    const filter = {};

    const options = { upsert: true };

    const removeDate = {
      $pop: {
        calendar: -1
      },
    };
    const addDate = {
        $push: {
            calendar: false
        },
      };
    const result1 = await userInfo.updateMany(filter, removeDate, options);
    const result2 = await userInfo.updateMany(filter, addDate, options);
    console.log(
      `${result1.matchedCount} document(s) matched the filter, updated ${result1.modifiedCount} document(s) I RAN!`,
    );
    console.log(
      `${result2.matchedCount} document(s) matched the filter, updated ${result2.modifiedCount} document(s)`,
    );
  } finally {
    await client.close();
  }
}
// bracket pair colorizer !!!!
async function updatePersonalCalendar(learnerName) {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const userInfo = database.collection("userInfo");
    const filter = {username: learnerName};

    const options = { upsert: false };

    const removeDate = {
      $pop: {
        calendar: 1
      },
    };
    const addDate = {
        $push: {
            calendar: true
        },
      };
      const result1 = await userInfo.updateOne(filter, removeDate, options);
      const result2 = await userInfo.updateOne(filter, addDate, options);
      console.log(
        `${result1.matchedCount} document(s) matched the filter, updated ${result1.modifiedCount} document(s)`,
      );
      console.log(
        `${result2.matchedCount} document(s) matched the filter, updated ${result2.modifiedCount} document(s)`,
      );
  } finally {
    await client.close();
  }
}
module.exports = { calendarRouter, updateCalendar, updatePersonalCalendar };
