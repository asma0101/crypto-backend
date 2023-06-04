var express = require('express');
var router = express.Router();
var coinsController = require("../controllers/coinsController");
const https = require('https');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
  
});

router.get('/api/coins', coinsController.getCoins);
router.get('/api/coins/rates', coinsController.getRates);

module.exports = router;
