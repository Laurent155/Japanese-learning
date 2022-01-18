const express = require('express');
const learnerName = require('./authRouter');

const practiceRouter = express.Router();


practiceRouter.route('/').get((req, res) => {
  res.render('practice');
});



module.exports = practiceRouter;