const express = require('express');

const accountRouter = express.Router();

accountRouter.route('/').get((req, res) => {
    res.render('account');
});

module.exports = accountRouter;