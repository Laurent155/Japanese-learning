const express = require('express');
const hiragana = require('../data/hiragana.json');
const katakana = require('../data/katakana.json');

const kanaRouter = express.Router();

kanaRouter.route('/').get((req, res) => {
  res.render('kana', {
    hiragana, katakana
  });
});



module.exports = kanaRouter;
