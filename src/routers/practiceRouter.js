const express = require('express');

const practiceRouter = express.Router();

practiceRouter.route('/').get((req, res) => {
  res.render('practice');
});

module.exports = practiceRouter;