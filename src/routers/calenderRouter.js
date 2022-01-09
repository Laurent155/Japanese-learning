const express = require('express');

const calenderRouter = express.Router();

calenderRouter.route('/').get((req, res) => {
    res.render('calender');
});

module.exports = calenderRouter;