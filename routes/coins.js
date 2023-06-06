var express = require('express');
var router = express.Router();
var coinsController = require("../controllers/coinsController");
const middleware = require('../utilities/middleware');


router.get('/', coinsController.getCoinsChains);
router.get('/liveCoins', coinsController.getLiveCoins);
router.post('/purchase',  coinsController.purchaseCoin);
router.get('/getUserCoins', coinsController.getUserCoins);
router.post('/transfer', coinsController.transferCoin);
module.exports = router;
