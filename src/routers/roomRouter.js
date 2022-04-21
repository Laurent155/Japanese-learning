const express = require("express");
const { MongoClient } = require("mongodb");
const passport = require("passport");
require("../config/passport.js")(passport);
const roomRouter = express.Router();
const url = process.env.databaseURL;
const client = new MongoClient(url);

roomRouter.route("/").post(async (req, res) => {
  const user2ID = req.body.user2ID;
  if (!req.user) {
    res.send("There is no user!");
  } else {
    // console.log("this is the user")
    // console.log(req.user);
    const room = await findOrCreateRoom(req.user._id, user2ID);
    res.send(room);
  }
  // const { user1, user2 } = req.body;
  // const room = await findOrCreateRoom(user1, user2);
  // console.log(room);
  // res.send(room);
});

roomRouter.route("/chat").get(async (req, res) => {
  if (!req.user) {
    res.send("There is no user!");
  } else {
    // res.send({ message: "chat window opened" });
    res.render("chat",{
      roomID: req.query.roomID
    });
  }
});

async function findOrCreateRoom(user1, user2) {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const roomInfo = database.collection("rooms");
    let filter = { _id: user1 + user2 };
    let room = await roomInfo.findOne(filter);
    if (room != null) {
      return room;
    }
    filter = { _id: user2 + user1 };
    room = await roomInfo.findOne(filter);
    if (room != null) {
      return room;
    }
    room = await roomInfo.insertOne(filter);
    room = room.ops[0];
    return room;
  } catch (error) {
    console.log(error);
  }
}

module.exports = roomRouter;
