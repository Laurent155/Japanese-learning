const express = require("express");
const { MongoClient } = require("mongodb");
const passport = require("passport");
require("../config/passport.js")(passport);
const roomRouter = express.Router();
const url = process.env.databaseURL;
const client = new MongoClient(url);

roomRouter.route('/').post(async (req, res) => {
    const user2ID = req.body.user2ID;
    if (!req.user) {
        res.send('There is no user!');
    } else {
        await createRoom(req.user._id, user2ID);
        res.send('received');
    }
})


async function createRoom(user1, user2) {
    try {
        await client.connect();
        const database = client.db("userInfo");
        const roomInfo = database.collection("rooms");
        let filter = { _id: user1 + user2 };
        let room = await roomInfo.findOne(filter);
        if (room){
            return room;
        } else{
            let filter = { _id: user2 + user1 };
            const options = { upsert: true };
            let room = await roomInfo.findOne(filter, options);
            return room;
        }
    } catch (error) {
        console.log(error);
    }
}







module.exports = roomRouter;