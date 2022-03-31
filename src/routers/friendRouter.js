const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const passport = require("passport");
require("../config/passport.js")(passport);
const friendRouter = express.Router();
const url = process.env.databaseURL;
const client = new MongoClient(url);

friendRouter.route("/").post(async (req, res) => {
  const user2ID = req.body.user2ID;
  if (!req.user) {
    res.send("There is no user!");
  } else {
    await addFriend(req.user._id, user2ID);
    res.send({ message: "friend added" });
  }
});

friendRouter.route("/").get(async (req, res) => {
  if (!req.user) {
    res.send("There is no user!");
  } else {
    const friends = await findFriends(req.user._id);
    console.log(friends);
    res.send({ friends });
  }
  // const { user1, user2 } = req.body;
  // const room = await findOrCreateRoom(user1, user2);
  // console.log(room);
  // res.send(room);
});

async function findFriends(userID) {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const userInfo = database.collection("userInfo");
    const query = { _id: ObjectId(userID) };
    const result = await userInfo.findOne(query);
    let friends = [];
    if (result) {
      console.log(result);
      let friendsID = result.friends;

      for (let friendID of friendsID) {
        let query = { _id: ObjectId(friendID) };
        let friend = await userInfo.findOne(query);
        friends.push(friend);
      }
    }
    return friends;
  } catch (error) {
    console.log(error);
  }
}

async function addFriend(user1, user2) {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const userInfo = database.collection("userInfo");
    console.log(user1);
    console.log(user2);
    let filter = { _id: ObjectId(user1) };
    const options = { upsert: true };
    let newFriend = {
      $push: {
        friends: ObjectId(user2),
      },
    };
    // console.log(filter);
    // let userfound = await userInfo.findOne(filter);
    // console.log(userfound);
    // return 'friend added';
    let result = await userInfo.updateOne(filter, newFriend);

    filter = { _id: ObjectId(user2) };
    newFriend = {
      $push: {
        friends: ObjectId(user1),
      },
    };
    result = await userInfo.updateOne(filter, newFriend);
    // console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = friendRouter;
