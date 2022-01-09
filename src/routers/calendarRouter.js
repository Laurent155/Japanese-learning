const express = require('express');

const calendarRouter = express.Router();

calendarRouter.route('/').get((req, res) => {
    res.render('calendar');
});

module.exports = calendarRouter;