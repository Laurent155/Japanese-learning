const express = require('express');
const learnerName = require('./accountRouter');

const practiceRouter = express.Router();


practiceRouter.route('/').get((req, res) => {
  res.render('practice');
});

practiceRouter.route('/write').get((req, res) => {
  res.render('write');
});

module.exports = practiceRouter;