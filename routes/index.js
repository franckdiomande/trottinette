var express = require('express');
var router = express.Router();
const path = require('path');

const dir = '../views/chart.html';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trottinette' });
});


router.get('/chart', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'chart.html'));
});

module.exports = router;
