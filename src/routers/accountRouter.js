const express = require('express');

const accountRouter = express.Router();

accountRouter.route('/').get((req, res) => {
    if (req.user){
        console.log("yeeyya");
        res.render('account'); // actual account page goes here!
    }
    else{
        res.render('account');
    }
    
});

module.exports = accountRouter;